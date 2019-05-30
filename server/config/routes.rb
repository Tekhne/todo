Rails.application.routes.draw do
  namespace :api do
    resource :signup, only: [:create]
    resource :signup_confirmation, only: [:update]
  end
end
