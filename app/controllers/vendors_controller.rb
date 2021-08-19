require 'date'
class VendorsController < ApplicationController
  def index
    render json: Vendor.select("email,name")
  end

  def show
    @vendor = Current.vendor
    @transactions = @vendor.transactions
    render 'vendor/show'
  end

  def payout
    date = Time.at(params[:payout_date]/1000.0)
    vendor = Vendor.find_by_id(params[:vendor_id])
    transactions_to_pay = vendor.transactions.where(created_at: date.all_day, payout_id: nil)
    if(transactions_to_pay.length > 0)
      new_payout = Payout.new
      payout_amount = 0.0
      fees = 0.0
      for transaction in transactions_to_pay do
        payout_amount += transaction.amount
        if(transaction.is_bank)
          fees += bank_fee(transaction.amount)
        else
          fees += credit_card_fee(transaction.amount)
        end
        new_payout.transactions << transaction  
      end
      new_payout.date = Date.today
      new_payout.vendor_id = vendor.id
      new_payout.fees = fees
      new_payout.amount_paid = payout_amount - fees
      new_payout_balance = vendor.payout_balance + new_payout.amount_paid
      puts("===================")
      puts(new_payout.amount_paid)
      if(new_payout.save!)
        vendor.update_attribute(:payout_balance, new_payout_balance)
        render json: {message: 'Paid'}, status: :ok
      else
        render json: {'error': 'Could not payout'}, status: :internal_server_error
      end
    else
      render json: {message: 'No Unpaid Transactions'}, status: :ok
    end
  end

  private
  def vendor_params
    params.permit(:id)
  end
  def bank_fee(amount)
    fee = (0.01*amount) + 1
  end

  def credit_card_fee(amount)
    fee = (0.029*amount) + 0.3
  end

end
