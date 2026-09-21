require 'rails_helper'

RSpec.describe "Api::V1::EmergencyProfiles", type: :request do
  describe "GET /api/v1/emergency/:public_token" do
    let!(:patient) { create(:patient) }

    context "com token existente" do
      before { get "/api/v1/emergency/#{patient.public_token}" }

      it "retorna status 200" do
        expect(response).to have_http_status(:ok)
      end

      it "exibe estritamente dados vitais para socorro" do
        json = JSON.parse(response.body)
        expect(json["display_name"]).to eq("Dona Maria")
        expect(json["full_name"]).to eq("Maria Francisca dos Santos")
        expect(json["age"]).to eq(patient.age)
        expect(json["birth_date"]).to eq("1950-05-10")
        expect(json["blood_type"]).to eq("O+")
        expect(json["allergies"]).to include("Dipirona")
        expect(json["medical_devices"]).to include("Marcapasso Cardíaco")
        expect(json["health_insurance_name"]).to eq("Unimed Fortaleza")
        expect(json["health_insurance_number"]).to eq("123456789-0")
        expect(json["medical_notes"]).to eq("Apresenta marcha instável e restrição hídrica")
      end

      it "não vaza informações privadas protegidas pela LGPD" do
        json = JSON.parse(response.body)
        expect(json).not_to have_key("cpf")
        expect(json).not_to have_key("rg")
        expect(json).not_to have_key("private_notes")
      end

      it "gera um registro em scan_logs" do
        expect {
          get "/api/v1/emergency/#{patient.public_token}"
        }.to change(ScanLog, :count).by(1)
      end
    end

    context "com token inexistente" do
      it "retorna status 404" do
        get "/api/v1/emergency/#{SecureRandom.uuid}"
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end