class Payout < ApplicationRecord
  belongs_to :vendor
  has_many :transactions
end
