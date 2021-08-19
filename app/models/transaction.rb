class Transaction < ApplicationRecord
  belongs_to :vendor
  belongs_to :payout, optional: true

  after_save :update_vendor
  attr_encrypted :credit_card, key: 'This is a key that is 256 bits!!'
  attr_encrypted :account_number, key: 'This is a key that is 256 bits!!'
  attr_encrypted :routing_number, key: 'This is a key that is 256 bits!!'
  attr_encrypted :cvv, key: 'This is a key that is 256 bits!!'

  validate :expiry_date_cannot_be_in_the_past
  validate :credit_card_is_valid, unless: :is_bank?
  validate :routing_number_is_valid, if: :is_bank?
  validates :amount, presence: true


  validates :credit_card, presence: true, unless: :is_bank?
  validates :expiry_date, presence: true, unless: :is_bank?
  # validates :cvv, presence: true, numericality: { only_integer: true, greater_than: 99, less_than: 1000}, unless :is_bank?


  validates :account_number, presence: true, if: :is_bank?
  validates :routing_number, presence: true, if: :is_bank?

  

  private
  def update_vendor
    if(self.vendor)
      self.vendor.update_balance
   end
    self.vendor.save
  end

  def expiry_date_cannot_be_in_the_past
    if expiry_date.present? && expiry_date < Date.today
      errors.add(:expiry_date, "can't be in the past")
    end
  end

  def credit_card_is_valid
    num_as_string = credit_card.to_s
    if(num_as_string.starts_with?('1111') || num_as_string.starts_with?('8888'))
      errors.add(:credit_card, "Cannot start with 1111 or 8888")
    end
  end

  def routing_number_is_valid
    if(RoutingNumber.where(routing_number: self.routing_number).empty?)
      errors.add(:routing_number, "Routing Number is invalid")
    end
  end

end
