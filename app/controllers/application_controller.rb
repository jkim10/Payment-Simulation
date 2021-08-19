class ApplicationController < ActionController::Base
    before_action :set_current_vendor
    def set_current_vendor
      # finds user with session data and stores it if present
      Current.vendor = Vendor.find_by(id: session[:vendor_id]) if session[:vendor_id]
    end
    def require_vendor_logged_in!
      # allows only logged in user
      redirect_to sign_in_path, alert: 'You must be signed in' if Current.vendor.nil?
    end
end
