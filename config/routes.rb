Rails.application.routes.draw do
  root "transactions#new"
  resources :transactions
  resources :vendors,:except => [:show]

  get 'sign_up', to: 'registrations#new'
  post 'sign_up', to: 'registrations#create'
  get 'sign_in', to: 'sessions#new'
  post 'sign_in', to: 'sessions#create', as: 'log_in'
  get 'audit', to: 'audits#audit'
  get 'payout_history', to: 'audits#payout_history'
  delete 'logout', to: 'sessions#destroy'
  get 'password', to: 'passwords#edit', as: 'edit_password'
  patch 'password', to: 'passwords#update'
  get 'password/reset', to: 'password_resets#new'
  post 'password/reset', to: 'password_resets#create'
  get 'password/reset/edit', to: 'password_resets#edit'
  patch 'password/reset/edit', to: 'password_resets#update'
  get 'portal', to: 'vendors#show'
  post 'payout', to: 'vendors#payout'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
