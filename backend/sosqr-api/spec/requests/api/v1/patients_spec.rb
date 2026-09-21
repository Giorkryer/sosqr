require 'rails_helper'

RSpec.describe "Api::V1::Patients", type: :request do
  let(:rsa_key) { OpenSSL::PKey::RSA.generate(2048) }
  let(:clerk_user_id) { "user_clerk_test_123" }
  let(:valid_token) { JWT.encode({ sub: clerk_user_id, exp: 1.day.from_now.to_i }, rsa_key, 'RS256') }
  let(:auth_headers) { { 'Authorization' => "Bearer #{valid_token}" } }

  before do
    allow(ENV).to receive(:[]).and_call_original
    allow(ENV).to receive(:[]).with('CLERK_PEM_PUBLIC_KEY').and_return(rsa_key.public_key.to_pem)
  end

  describe "GET /api/v1/patients sem autenticação" do
    it "rejeita requisições sem o token do Clerk com status 401" do
      get "/api/v1/patients"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/v1/patients com autenticação" do
    let!(:patient_owned) { create(:patient, clerk_user_id: clerk_user_id, display_name: "Idoso Meu") }
    let!(:patient_other) { create(:patient, clerk_user_id: "other_user", display_name: "Idoso Outro") }

    it "lista apenas os pacientes pertencentes ao cuidador autenticado" do
      get "/api/v1/patients", headers: auth_headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(1)
      expect(json.first["display_name"]).to eq("Idoso Meu")
    end

    it "retorna as informações de last_scan com data formatada e IP quando houver escaneamento" do
      create(:scan_log, patient: patient_owned, ip_address: "187.12.34.56", scanned_at: Time.zone.parse("2026-09-15 10:30:00"))

      get "/api/v1/patients", headers: auth_headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      last_scan = json.first["last_scan"]
      expect(last_scan).to be_present
      expect(last_scan["ip_address"]).to eq("187.12.34.56")
      expect(last_scan["date"]).to eq("15/09/2026 10:30")
    end

    it "retorna last_scan como nil quando o paciente não possui escaneamentos" do
      get "/api/v1/patients", headers: auth_headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.first["last_scan"]).to be_nil
    end
  end

  describe "POST /api/v1/patients" do
    let(:valid_params) do
      {
        patient: {
          display_name: "Seu José",
          full_name: "José Ferreira da Silva",
          blood_type: "A+",
          gender: "Masculino",
          health_insurance_name: "Bradesco Saúde",
          health_insurance_number: "987654321",
          medical_devices: ["Auditivo bilateral"],
          emergency_contacts_attributes: [
            {
              name: "Maria José",
              phone_number: "+5511999991111",
              relationship: "Esposa",
              is_primary: true
            }
          ]
        }
      }
    end

    it "cria um novo paciente com os novos campos e contatos aninhados" do
      expect {
        post "/api/v1/patients", params: valid_params, headers: auth_headers, as: :json
      }.to change(Patient, :count).by(1).and change(EmergencyContact, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["gender"]).to eq("Masculino")
      expect(json["health_insurance_name"]).to eq("Bradesco Saúde")
      expect(json["health_insurance_number"]).to eq("987654321")
      expect(json["medical_devices"]).to eq(["Auditivo bilateral"])
    end

    it "assume o primeiro nome quando display_name não é fornecido (before_validation)" do
      params_without_display = {
        patient: {
          full_name: "Sebastião Pereira Santos",
          blood_type: "B+"
        }
      }

      post "/api/v1/patients", params: params_without_display, headers: auth_headers, as: :json

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["display_name"]).to eq("Sebastião")
    end
  end

  describe "DELETE /api/v1/patients/:id" do
    let!(:patient_owned) { create(:patient, clerk_user_id: clerk_user_id, display_name: "Idoso Para Excluir") }
    let!(:patient_other) { create(:patient, clerk_user_id: "other_user", display_name: "Idoso De Outro") }

    it "exclui o paciente pertencente ao cuidador autenticado e retorna status 204 no_content" do
      expect {
        delete "/api/v1/patients/#{patient_owned.id}", headers: auth_headers
      }.to change(Patient, :count).by(-1)

      expect(response).to have_http_status(:no_content)
      expect(Patient.exists?(patient_owned.id)).to be_falsey
    end

    it "retorna status 404 ao tentar excluir paciente pertencente a outro cuidador" do
      expect {
        delete "/api/v1/patients/#{patient_other.id}", headers: auth_headers
      }.not_to change(Patient, :count)

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json["error"]).to include("não encontrado")
    end

    it "retorna status 401 para requisição sem autenticação" do
      delete "/api/v1/patients/#{patient_owned.id}"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end