class CreatePatients < ActiveRecord::Migration[8.1]
  def change
    create_table :patients do |t|
      t.string :clerk_user_id
      t.uuid :public_token
      t.string :display_name
      t.string :full_name
      t.string :cpf
      t.string :rg
      t.string :sus_number
      t.date :birth_date
      t.string :blood_type
      t.jsonb :allergies
      t.jsonb :chronic_conditions
      t.jsonb :medications_in_use
      t.boolean :organ_donor
      t.text :private_notes

      t.timestamps
    end
    add_index :patients, :clerk_user_id
    add_index :patients, :public_token, unique: true
  end
end
