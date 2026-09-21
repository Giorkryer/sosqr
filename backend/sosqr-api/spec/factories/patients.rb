FactoryBot.define do
  factory :patient do
    clerk_user_id { "user_test_#{SecureRandom.hex(4)}" }
    display_name { "Dona Maria" }
    full_name { "Maria Francisca dos Santos" }
    cpf { "123.456.789-00" }
    rg { "1234567 SSP/CE" }
    sus_number { "898001234567890" }
    birth_date { Date.new(1950, 5, 10) }
    blood_type { "O+" }
    organ_donor { true }
    gender { "Feminino" }
    health_insurance_name { "Unimed Fortaleza" }
    health_insurance_number { "123456789-0" }
    medical_devices { ["Marcapasso Cardíaco"] }
    allergies { ["Dipirona", "Penicilina"] }
    chronic_conditions { ["Hipertensão", "Diabetes Tipo 2"] }
    medications_in_use { ["Losartana 50mg", "Metformina 850mg"] }
    medical_notes { "Apresenta marcha instável e restrição hídrica" }
    private_notes { "Histórico familiar sigiloso" }
  end
end