FactoryBot.define do
  factory :emergency_contact do
    association :patient
    name { "Carlos Eduardo" }
    phone_number { "(85) 98888-7777" }
    relationship { "Filho" }
    is_primary { true }
  end
end
