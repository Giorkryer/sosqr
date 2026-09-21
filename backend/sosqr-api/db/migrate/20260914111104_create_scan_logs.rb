class CreateScanLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :scan_logs do |t|
      t.references :patient, null: false, foreign_key: true
      t.string :ip_address
      t.text :user_agent
      t.datetime :scanned_at

      t.timestamps
    end
  end
end
