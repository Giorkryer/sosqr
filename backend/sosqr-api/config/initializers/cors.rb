Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    custom_origins = ENV['ALLOWED_ORIGINS'].to_s.split(',').map(&:strip).reject(&:empty?)

    origins 'http://localhost:5173',
            'http://127.0.0.1:5173',
            /\Ahttps:\/\/.*\.vercel\.app\z/,
            /\Ahttps:\/\/.*\.onrender\.com\z/,
            *custom_origins

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ["Authorization"]
  end
end
