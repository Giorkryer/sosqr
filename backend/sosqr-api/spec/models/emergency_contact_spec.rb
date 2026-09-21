require 'rails_helper'

RSpec.describe EmergencyContact, type: :model do
  let(:patient) { create(:patient) }

  describe "associações" do
    it "pertence a um paciente (belongs_to :patient)" do
      contact = create(:emergency_contact, patient: patient)
      expect(contact.patient).to eq(patient)
    end

    it "é inválido sem um paciente associado" do
      contact = build(:emergency_contact, patient: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:patient]).to be_present
    end
  end

  describe "validações" do
    it "deve ser válido com dados completos" do
      contact = build(:emergency_contact, patient: patient)
      expect(contact).to be_valid
    end

    it "deve validar presença de name" do
      contact = build(:emergency_contact, patient: patient, name: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:name]).to include(I18n.t('errors.messages.blank'))
    end

    it "deve validar presença de phone_number" do
      contact = build(:emergency_contact, patient: patient, phone_number: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:phone_number]).to include(I18n.t('errors.messages.blank'))
    end

    it "deve validar presença de relationship" do
      contact = build(:emergency_contact, patient: patient, relationship: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:relationship]).to include(I18n.t('errors.messages.blank'))
    end

    it "is_primary deve aceitar valores booleanos (padrão false ou configurável)" do
      default_contact = EmergencyContact.new(
        name: "Ana Clara",
        phone_number: "(85) 97777-6666",
        relationship: "Irmã",
        patient: patient
      )
      expect(default_contact.is_primary).to be(false)
      expect(default_contact).to be_valid

      primary_contact = build(:emergency_contact, patient: patient, is_primary: true)
      expect(primary_contact.is_primary).to be(true)
      expect(primary_contact).to be_valid

      secondary_contact = build(:emergency_contact, patient: patient, is_primary: false)
      expect(secondary_contact.is_primary).to be(false)
      expect(secondary_contact).to be_valid
    end
  end
end
