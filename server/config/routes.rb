Rails.application.routes.draw do
  namespace :api do
    resource :login, only: %i[create destroy]
    resource :signup, only: %i[create]
    resource :signup_confirmation, only: %i[update]
    resources :todos, only: %i[create destroy index]
    resources :todos_reorders, only: %i[create]
  end
end
