require 'rails_helper'

RSpec.describe "Api::V1::Admin::Dashboard", type: :request do
  let(:rsa_key) { OpenSSL::PKey::RSA.generate(2048) }
  let(:regular_user_id) { "user_clerk_regular_123" }
  let(:admin_user_id) { "user_clerk_admin_999" }

  let(:regular_token) do
    JWT.encode({ sub: regular_user_id, exp: 1.day.from_now.to_i }, rsa_key, 'RS256')
  end

  let(:admin_metadata_token) do
    JWT.encode(
      {
        sub: admin_user_id,
        metadata: { role: 'admin' },
        exp: 1.day.from_now.to_i
      },
      rsa_key,
      'RS256'
    )
  end

  let(:admin_public_metadata_token) do
    JWT.encode(
      {
        sub: admin_user_id,
        public_metadata: { role: 'admin' },
        exp: 1.day.from_now.to_i
      },
      rsa_key,
      'RS256'
    )
  end

  let(:regular_headers) { { 'Authorization' => "Bearer #{regular_token}" } }
  let(:admin_metadata_headers) { { 'Authorization' => "Bearer #{admin_metadata_token}" } }
  let(:admin_public_metadata_headers) { { 'Authorization' => "Bearer #{admin_public_metadata_token}" } }

  before do
    allow(ENV).to receive(:[]).and_call_original
    allow(ENV).to receive(:[]).with('CLERK_PEM_PUBLIC_KEY').and_return(rsa_key.public_key.to_pem)
    allow(ENV).to receive(:[]).with('ADMIN_CLERK_IDS').and_return(nil)
  end

  describe "GET /api/v1/admin/dashboard" do
    context "quando a requisição não possui role de admin" do
      it "retorna status 403 Forbidden com mensagem de erro específica para usuário comum" do
        get "/api/v1/admin/dashboard", headers: regular_headers

        expect(response).to have_http_status(:forbidden)
        json = JSON.parse(response.body)
        expect(json["error"]).to eq("Acesso não autorizado ao painel administrativo.")
      end

      it "retorna status 401 Unauthorized quando nenhum token for fornecido" do
        get "/api/v1/admin/dashboard"

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["error"]).to eq("Token não fornecido")
      end
    end

    context "quando autenticado como admin" do
      let!(:caregiver_1) { "user_caregiver_1" }
      let!(:caregiver_2) { "user_caregiver_2" }

      let!(:patient_1) do
        create(:patient, clerk_user_id: caregiver_1, full_name: "Francisca dos Santos", display_name: "Francisca")
      end
      let!(:patient_2) do
        create(:patient, clerk_user_id: caregiver_1, full_name: "Antônio da Silva", display_name: "Antônio")
      end
      let!(:patient_3) do
        create(:patient, clerk_user_id: caregiver_2, full_name: "Helena Souza", display_name: "Helena")
      end

      let!(:scan_old) do
        create(:scan_log,
               patient: patient_1,
               ip_address: "187.12.34.56",
               user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)",
               scanned_at: 2.days.ago)
      end

      let!(:scan_today) do
        create(:scan_log,
               patient: patient_2,
               ip_address: "191.209.45.12",
               user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
               scanned_at: 1.hour.ago)
      end

      it "retorna HTTP 200 OK com as chaves corretas do dashboard via metadata['role'] == 'admin'" do
        get "/api/v1/admin/dashboard", headers: admin_metadata_headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)

        expect(json).to have_key("total_patients")
        expect(json).to have_key("total_scans")
        expect(json).to have_key("total_caregivers")
        expect(json).to have_key("scans_today")
        expect(json).to have_key("recent_scans")

        expect(json["total_patients"]).to eq(3)
        expect(json["total_scans"]).to eq(2)
        expect(json["total_caregivers"]).to eq(2)
        expect(json["scans_today"]).to eq(1)

        recent = json["recent_scans"]
        expect(recent.length).to eq(2)

        first_scan = recent.first
        expect(first_scan["id"]).to eq(scan_today.id)
        expect(first_scan["patient_name"]).to eq("Antônio da Silva")
        expect(first_scan["ip_address"]).to eq("191.209.***.***")
        expect(first_scan["user_agent"]).to eq("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        expect { Time.iso8601(first_scan["scanned_at"]) }.not_to raise_error
      end

      it "retorna HTTP 200 OK quando admin validado via public_metadata['role'] == 'admin'" do
        get "/api/v1/admin/dashboard", headers: admin_public_metadata_headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["total_patients"]).to eq(3)
      end

      it "retorna HTTP 200 OK quando o usuário está listado na variável de ambiente ADMIN_CLERK_IDS" do
        allow(ENV).to receive(:[]).with('ADMIN_CLERK_IDS').and_return("other_user, #{regular_user_id}")

        get "/api/v1/admin/dashboard", headers: regular_headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["total_patients"]).to eq(3)
      end

      it "retorna 'Perfil Desativado' quando o paciente associado foi removido ou não possui full_name" do
        orphan_scan = build(:scan_log, patient: nil, ip_address: "10.0.0.1", scanned_at: Time.current)
        orphan_scan.save(validate: false)

        get "/api/v1/admin/dashboard", headers: admin_metadata_headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        scan = json["recent_scans"].find { |s| s["id"] == orphan_scan.id }
        expect(scan["patient_name"]).to eq("Perfil Desativado")
      end

      it "limita a lista de recent_scans aos últimos 50 registros" do
        create_list(:scan_log, 55, patient: patient_3, scanned_at: 5.minutes.ago)

        get "/api/v1/admin/dashboard", headers: admin_metadata_headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["recent_scans"].length).to eq(50)
      end
    end
  end
end
