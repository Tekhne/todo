Rails.application.routes.draw do
  namespace :api do
    resource :signup, only: [:create]
  end
end
