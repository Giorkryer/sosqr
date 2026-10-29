class AddUserIdToPatients < ActiveRecord::Migration[8.1]
  def up
    unless column_exists?(:patients, :user_id)
      add_column :patients, :user_id, :string
      add_index :patients, :user_id
    end

    # Sincroniza registros existentes caso clerk_user_id esteja populado
    if column_exists?(:patients, :clerk_user_id)
      execute <<-SQL
        UPDATE patients
        SET user_id = clerk_user_id
        WHERE user_id IS NULL AND clerk_user_id IS NOT NULL;
      SQL
    end
  end

  def down
    if column_exists?(:patients, :user_id)
      remove_index :patients, :user_id if index_exists?(:patients, :user_id)
      remove_column :patients, :user_id
    end
  end
end
