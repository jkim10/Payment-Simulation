class SessionsController < ApplicationController
    def new; end
    def create
      vendor = Vendor.find_by(email: params[:email])
      # finds existing user, checks to see if user can be authenticated
      if vendor.present? && vendor.authenticate(params[:password])
      # sets up user.id sessions
        session[:vendor_id] = vendor.id
        redirect_to root_path, notice: 'Logged in successfully'
      else
        flash.now[:alert] = 'Invalid email or password'
        render :new
      end
    end
    def destroy
      # deletes user session
      session[:vendor_id] = nil
      redirect_to root_path, notice: 'Logged Out'
    end
  end