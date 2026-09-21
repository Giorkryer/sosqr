class AddDetailsToPatients < ActiveRecord::Migration[8.1]
  def change
    add_column :patients, :gender, :string
    add_column :patients, :medical_devices, :jsonb, default: []
    add_column :patients, :health_insurance_name, :string
    add_column :patients, :health_insurance_number, :string
  end
end
