class AuditsController < ApplicationController
    def audit
        begin
          date = Date.parse(params[:audit_date])
          if(params[:vendor_id])
            @transactions = Transaction.where(created_at: date.all_day, vendor_id: params[:vendor_id])
          else
            @transactions = Transaction.where(created_at: date.all_day)
          end
          render json: @transactions
        rescue => error
          render json: {'error': error}, status: :internal_server_error
        end
    end

    def payout_history
      begin
        if(params[:vendor_id])
          payouts = Payout.where(vendor_id: params[:vendor_id])
        else
          payouts = Payout.all
        end
        nested = []
        for payout in payouts do
          nested.push({payout: payout, transactions: payout.transactions, vendor_email: payout.vendor.email})
        end
        render json: nested
      rescue => error
        render json: {'error': error}, status: :internal_server_error
      end
    end

    
end
