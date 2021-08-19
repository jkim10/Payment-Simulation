class Vendor < ApplicationRecord
    has_many :transactions
    has_many :payouts
    before_save :update_balance

    validates :email, uniqueness: true, format: { with: /\A[^@\s]+@[^@\s]+\z/, message: 'Invalid email' }                                       


    has_secure_password

    def update_balance
        unpaid_transactions = self.transactions.where(payout_id: nil)
        balance = 0
        for transaction in unpaid_transactions do
            balance += transaction.amount
        end
        self.balance = balance
    end
end
