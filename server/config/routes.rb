Rails.application.routes.draw do
  namespace :api do
    resource :login, only: [:create]
    resource :signup, only: [:create]
    resource :signup_confirmation, only: [:update]
  end
end
