class AddSusNumberToPatients < ActiveRecord::Migration[8.1]
  def change
    add_column :patients, :sus_number, :string, if_not_exists: true
  end
end
