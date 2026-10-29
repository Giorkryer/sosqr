class Patient < ApplicationRecord
  has_many :emergency_contacts, dependent: :destroy
  has_many :scan_logs, dependent: :destroy

  accepts_nested_attributes_for :emergency_contacts, allow_destroy: true

  before_validation :ensure_display_name, :sanitize_sus_number, :sync_user_identifiers
  before_create :set_public_token

  validates :display_name, :blood_type, presence: true
  validates :sus_number, length: { is: 15 }, allow_blank: true 
  validates :sus_number, format: { with: /\A\d+\z/, message: "deve conter apenas números" }, allow_blank: true


  def age
    return nil if birth_date.blank?

    b_date = birth_date.is_a?(Date) ? birth_date : Date.parse(birth_date.to_s)
    today = Date.current
    calculated_age = today.year - b_date.year
    calculated_age -= 1 if today.month < b_date.month || (today.month == b_date.month && today.day < b_date.day)
    calculated_age
  rescue ArgumentError
    nil
  end

  def last_scan
    last_log = scan_logs.max_by { |s| s.scanned_at || s.created_at }
    return nil unless last_log

    timestamp = last_log.scanned_at || last_log.created_at
    formatted = timestamp&.strftime("%d/%m/%Y %H:%M")
    {
      date: formatted,
      scanned_at: formatted,
      ip_address: last_log.ip_address,
      ip: last_log.ip_address
    }
  end

  private

  def ensure_display_name
    return if display_name.present?

    if full_name.present?
      first_name = full_name.to_s.strip.split(/\s+/).first
      self.display_name = first_name.presence || full_name.strip
    end
  end

  def set_public_token
    self.public_token ||= SecureRandom.uuid
  end

  def sanitize_sus_number
    self.sus_number = sus_number.to_s.gsub(/\D/, "").strip if sus_number.present?
  end

  def sync_user_identifiers
    if respond_to?(:user_id) && respond_to?(:clerk_user_id)
      self.user_id = clerk_user_id if user_id.blank? && clerk_user_id.present?
      self.clerk_user_id = user_id if clerk_user_id.blank? && user_id.present?
    end
  end
end