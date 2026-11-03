class MakePreviousSurgeriesNotNull < ActiveRecord::Migration[8.1]
  def up
    execute "UPDATE patients SET previous_surgeries = '[]'::jsonb WHERE previous_surgeries IS NULL"
    change_column_null :patients, :previous_surgeries, false
  end

  def down
    change_column_null :patients, :previous_surgeries, true
  end
end
