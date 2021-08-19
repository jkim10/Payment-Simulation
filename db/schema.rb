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

ActiveRecord::Schema.define(version: 2021_08_19_165205) do

  create_table "payouts", force: :cascade do |t|
    t.datetime "date"
    t.integer "vendor_id", null: false
    t.decimal "amount_paid", precision: 8, scale: 2, default: "0.0"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "fees", precision: 8, scale: 2, default: "0.0"
    t.index ["vendor_id"], name: "index_payouts_on_vendor_id"
  end

  create_table "routing_numbers", force: :cascade do |t|
    t.integer "routing_number"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "transactions", force: :cascade do |t|
    t.datetime "transaction_date"
    t.string "encrypted_credit_card"
    t.string "encrypted_credit_card_iv"
    t.integer "vendor_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "expiry_date"
    t.string "encrypted_cvv"
    t.string "encrypted_cvv_iv"
    t.integer "billing_zip"
    t.string "encrypted_account_number"
    t.string "encrypted_account_number_iv"
    t.string "encrypted_routing_number"
    t.string "encrypted_routing_number_iv"
    t.boolean "is_bank"
    t.integer "payout_id"
    t.decimal "amount"
    t.datetime "bill_me_date"
    t.index ["payout_id"], name: "index_transactions_on_payout_id"
    t.index ["vendor_id"], name: "index_transactions_on_vendor_id"
  end

  create_table "vendors", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.decimal "balance", default: "0.0"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "payout_balance", precision: 8, scale: 2, default: "0.0"
  end

  add_foreign_key "payouts", "vendors"
  add_foreign_key "transactions", "payouts"
  add_foreign_key "transactions", "vendors"
end
