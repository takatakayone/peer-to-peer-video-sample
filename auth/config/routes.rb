Rails.application.routes.draw do
  post '/authenticate', to: 'authenticates#authenticate'
end
