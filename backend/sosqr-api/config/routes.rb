Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # Root endpoint for quick uptime/status verification
  root to: proc { [200, { "Content-Type" => "application/json" }, [{ status: "online", service: "SOSqr API", version: "v1" }.to_json]] }

  namespace :api do
    namespace :v1 do
      resources :patients
      get 'emergency/:public_token', to: 'emergency_profiles#show'

      namespace :admin do
        get 'dashboard', to: 'dashboard#index'
      end
    end
  end
end