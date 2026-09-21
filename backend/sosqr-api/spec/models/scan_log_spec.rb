require 'rails_helper'

RSpec.describe ScanLog, type: :model do
  let(:patient) { create(:patient) }

  describe "associações" do
    it "pertence a um paciente (belongs_to :patient)" do
      scan_log = create(:scan_log, patient: patient)
      expect(scan_log.patient).to eq(patient)
    end

    it "é inválido sem um paciente associado" do
      scan_log = build(:scan_log, patient: nil)
      expect(scan_log).not_to be_valid
      expect(scan_log.errors[:patient]).to be_present
    end
  end

  describe "persistência e dados de auditoria" do
    it "deve salvar e persistir corretamente os dados de auditoria (ip_address, user_agent, scanned_at)" do
      audit_time = Time.current.change(usec: 0)
      scan_log = create(
        :scan_log,
        patient: patient,
        ip_address: "191.209.10.5",
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        scanned_at: audit_time
      )

      persisted = ScanLog.find(scan_log.id)
      expect(persisted.ip_address).to eq("191.209.10.5")
      expect(persisted.user_agent).to eq("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)")
      expect(persisted.scanned_at.to_i).to eq(audit_time.to_i)
      expect(persisted.patient_id).to eq(patient.id)
    end
  end
end
