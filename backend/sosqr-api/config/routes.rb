Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :patients
      get 'emergency/:public_token', to: 'emergency_profiles#show'

      namespace :admin do
        get 'dashboard', to: 'dashboard#show'
      end
    end
  end
end