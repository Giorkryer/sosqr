class EmergencyContact < ApplicationRecord
  belongs_to :patient

  attribute :is_primary, :boolean, default: false

  validates :name, :phone_number, :relationship, presence: true
  validates :is_primary, inclusion: { in: [true, false] }
end
