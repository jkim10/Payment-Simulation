require 'date'
class TransactionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: Vendor.all
  end
  def new
  end

  def show
    @transaction = Transaction.find(params[:id]).slice(:created_at, :amount, :vendor_id, :is_bank)
    @vendor = Vendor.find(@transaction['vendor_id'])
  end

  def create
    begin
      vendor = Vendor.find_by_email(params['vendor_email'])
      is_bank = params['is_bank']    
      res_transaction_params = {
        vendor: vendor,
        is_bank: is_bank,
        amount: transaction_params['amount']
      }
      if (is_bank)
        res_transaction_params['account_number'] = transaction_params['account_number']
        res_transaction_params['routing_number'] = transaction_params['routing_number']
      else
        res_transaction_params['credit_card'] = transaction_params['credit_card']
        res_transaction_params['cvv'] = transaction_params['cvv']
        res_transaction_params['expiry_date'] = Date.strptime(transaction_params['expiry_date'], '%Y-%m')
      end
      @transaction = Transaction.new(res_transaction_params)
      if(@transaction.save)
        redirect_to @transaction
      else
        render json: @transaction.errors, status: :internal_server_error
      end
    rescue => error
      render json: {'error': error}, status: :internal_server_error
    end
    
  end


  private
  def transaction_params
    params.require(:transaction).permit(:is_bank, :account_number, :bill_me_date, :routing_number, :credit_card, 'card_number', :cvv, :expiry_date, :vendor, :amount)
  end
end
