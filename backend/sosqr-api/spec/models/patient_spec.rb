require 'rails_helper'

RSpec.describe Patient, type: :model do
  describe "validações" do
    it "é válido com atributos obrigatórios válidos" do
      patient = build(:patient)
      expect(patient).to be_valid
    end

    it "deve exigir blood_type" do
      patient = build(:patient, blood_type: nil)
      expect(patient).not_to be_valid
      expect(patient.errors[:blood_type]).to include(I18n.t('errors.messages.blank'))
    end

    it "é inválido se display_name e full_name estiverem ambos ausentes" do
      patient = build(:patient, display_name: nil, full_name: nil)
      expect(patient).not_to be_valid
      expect(patient.errors[:display_name]).to include(I18n.t('errors.messages.blank'))
    end
  end

  describe "callbacks" do
    describe "#set_public_token" do
      it "gera automaticamente um UUID v4 válido no campo public_token se nenhum for fornecido antes de salvar" do
        patient = create(:patient, public_token: nil)
        expect(patient.public_token).to be_present
        expect(patient.public_token).to match(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i)
      end

      it "não sobrescreve o public_token se um já tiver sido informado" do
        custom_uuid = SecureRandom.uuid
        patient = create(:patient, public_token: custom_uuid)
        expect(patient.public_token).to eq(custom_uuid)
      end
    end

    describe "#ensure_display_name" do
      it "mantém o display_name se já estiver preenchido" do
        patient = build(:patient, display_name: "Vovô Chico", full_name: "Francisco de Assis")
        patient.valid?
        expect(patient.display_name).to eq("Vovô Chico")
      end

      it "assume o primeiro nome do full_name se display_name for fornecido vazio ou nil" do
        patient_nil = build(:patient, display_name: nil, full_name: "Maria Francisca dos Santos")
        patient_nil.valid?
        expect(patient_nil.display_name).to eq("Maria")

        patient_blank = build(:patient, display_name: "   ", full_name: "Maria Francisca dos Santos")
        patient_blank.valid?
        expect(patient_blank.display_name).to eq("Maria")
      end

      it "assume o full_name se for apenas uma palavra e display_name estiver em branco" do
        patient = build(:patient, display_name: "", full_name: "Geraldo")
        patient.valid?
        expect(patient.display_name).to eq("Geraldo")
      end
    end
  end

  describe "métodos auxiliares e regras de negócio" do
    describe "#age" do
      let(:today) { Date.current }

      it "calcula a idade exata com base em birth_date e na data atual quando o aniversário já passou no ano" do
        patient = build(:patient, birth_date: today - 50.years - 2.days)
        expect(patient.age).to eq(50)
      end

      it "trata corretamente se o aniversário do ano atual ainda não tiver passado" do
        patient = build(:patient, birth_date: today - 50.years + 2.days)
        expect(patient.age).to eq(49)
      end

      it "calcula a idade corretamente no dia exato do aniversário" do
        patient = build(:patient, birth_date: today - 50.years)
        expect(patient.age).to eq(50)
      end

      it "retorna nil com segurança caso birth_date esteja ausente" do
        patient = build(:patient, birth_date: nil)
        expect(patient.age).to be_nil
      end
    end

    describe "#last_scan" do
      let(:patient) { create(:patient) }

      it "retorna nil se o paciente não possuir nenhum scan_log" do
        expect(patient.last_scan).to be_nil
      end

      it "retorna as informações de data formatada e IP do último scan_log" do
        create(:scan_log, patient: patient, ip_address: "192.168.1.1", scanned_at: 2.days.ago)
        recent_scan = create(:scan_log, patient: patient, ip_address: "10.0.0.1", scanned_at: 1.hour.ago)

        last_scan = patient.last_scan
        expect(last_scan).to be_a(Hash)
        expect(last_scan[:ip_address]).to eq("10.0.0.1")
        expect(last_scan[:date]).to eq(recent_scan.scanned_at.strftime("%d/%m/%Y %H:%M"))
      end
    end
  end

  describe "associações e deleção em cascata" do
    let!(:patient) { create(:patient) }
    let!(:contact) { create(:emergency_contact, patient: patient) }
    let!(:scan_log) { create(:scan_log, patient: patient) }

    it "exclui os contatos de emergência associados ao deletar o paciente (has_many :emergency_contacts, dependent: :destroy)" do
      expect { patient.destroy }.to change(EmergencyContact, :count).by(-1)
      expect(EmergencyContact.exists?(contact.id)).to be(false)
    end

    it "exclui os scan_logs associados ao deletar o paciente (has_many :scan_logs, dependent: :destroy)" do
      expect { patient.destroy }.to change(ScanLog, :count).by(-1)
      expect(ScanLog.exists?(scan_log.id)).to be(false)
    end

    it "permite criar e destruir contatos via atributos aninhados (accepts_nested_attributes_for)" do
      expect {
        patient.update!(
          emergency_contacts_attributes: [
            { name: "Mariana Silva", phone_number: "(85) 99111-2222", relationship: "Filha", is_primary: true }
          ]
        )
      }.to change(patient.emergency_contacts, :count).by(1)

      new_contact = patient.emergency_contacts.last
      expect {
        patient.update!(
          emergency_contacts_attributes: [
            { id: new_contact.id, _destroy: true }
          ]
        )
      }.to change(patient.emergency_contacts, :count).by(-1)

      expect(EmergencyContact.exists?(new_contact.id)).to be(false)
    end
  end
end
