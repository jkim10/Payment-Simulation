class RegistrationsController < ApplicationController
    def new
      @vendor = Vendor.new
    end
    def create
      @vendor = Vendor.new(vendor_params)
      if @vendor.save
        session[:vendor_id] = @vendor.id
        redirect_to root_path, notice: 'Successfully created account'
      else
        render :new
      end
    end
    private
    def vendor_params
      params.permit(:email, :password, :password_confirmation)
    end
  end