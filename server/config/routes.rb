Rails.application.routes.draw do
  resource :signup, only: [:create]
end
