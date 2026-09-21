# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_19_063300) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "emergency_contacts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_primary"
    t.string "name"
    t.bigint "patient_id", null: false
    t.string "phone_number"
    t.string "relationship"
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_emergency_contacts_on_patient_id"
  end

  create_table "patients", force: :cascade do |t|
    t.jsonb "allergies"
    t.date "birth_date"
    t.string "blood_type"
    t.jsonb "chronic_conditions"
    t.string "clerk_user_id"
    t.string "cpf"
    t.datetime "created_at", null: false
    t.string "display_name"
    t.string "full_name"
    t.string "gender"
    t.string "health_insurance_name"
    t.string "health_insurance_number"
    t.jsonb "medical_devices", default: []
    t.text "medical_notes"
    t.jsonb "medications_in_use"
    t.boolean "organ_donor"
    t.text "private_notes"
    t.uuid "public_token"
    t.string "rg"
    t.string "sus_number"
    t.datetime "updated_at", null: false
    t.index ["clerk_user_id"], name: "index_patients_on_clerk_user_id"
    t.index ["public_token"], name: "index_patients_on_public_token", unique: true
  end

  create_table "scan_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "ip_address"
    t.bigint "patient_id", null: false
    t.datetime "scanned_at"
    t.datetime "updated_at", null: false
    t.text "user_agent"
    t.index ["patient_id"], name: "index_scan_logs_on_patient_id"
  end

  add_foreign_key "emergency_contacts", "patients"
  add_foreign_key "scan_logs", "patients"
end
