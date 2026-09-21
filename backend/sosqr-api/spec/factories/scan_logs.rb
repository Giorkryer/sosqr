FactoryBot.define do
  factory :scan_log do
    association :patient
    ip_address { "191.209.10.5" }
    user_agent { "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)" }
    scanned_at { Time.current }
  end
end
