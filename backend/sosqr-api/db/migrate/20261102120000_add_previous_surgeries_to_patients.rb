class AddPreviousSurgeriesToPatients < ActiveRecord::Migration[8.1]
  def change
    add_column :patients, :previous_surgeries, :jsonb, default: [], if_not_exists: true
  end
end
