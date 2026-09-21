class CreateEmergencyContacts < ActiveRecord::Migration[8.1]
  def change
    create_table :emergency_contacts do |t|
      t.references :patient, null: false, foreign_key: true
      t.string :name
      t.string :phone_number
      t.string :relationship
      t.boolean :is_primary

      t.timestamps
    end
  end
end
