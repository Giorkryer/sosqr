class AddMedicalNotesToPatients < ActiveRecord::Migration[8.1]
  def change
    add_column :patients, :medical_notes, :text
  end
end
