require 'net/http'
require 'json'
require 'jwt'

class ApplicationController < ActionController::API
  before_action :authenticate_user!

  attr_reader :current_user_id, :claims, :jwt_claims, :current_user_role

  private

  def authenticate_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header.present?

    # 1. Se não houver token no cabeçalho
    unless token
      if Rails.env.development?
        @current_user_id = 'dev_cuidador_local'
        @current_user_role = 'admin'
        return
      else
        return render json: { error: 'Token de autenticação não fornecido' }, status: :unauthorized
      end
    end

    # 2. Decodificação e Validação do Token
    decoded = decode_token(token)

    @claims = decoded[0] || {}
    @jwt_claims = @claims
    @current_user_id = @claims['sub'].presence || @claims['id'].presence || 'dev_cuidador_local'
    @current_user_role = @claims.dig('app_metadata', 'role') ||
                         @claims.dig('user_metadata', 'role') ||
                         @claims['role'] ||
                         (Rails.env.development? ? 'admin' : nil)
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    Rails.logger.warn "[AUTH ERROR] Falha na validação do token JWT: #{e.class} - #{e.message}"
    render json: { error: 'Token inválido ou expirado', details: e.message }, status: :unauthorized
  rescue StandardError => e
    Rails.logger.error "[AUTH UNEXPECTED ERROR] #{e.class} - #{e.message}"
    render json: { error: 'Erro ao validar autenticação', details: e.message }, status: :internal_server_error
  end

  def decode_token(token)
    # Identifica o algoritmo no cabeçalho (ex: ES256 no Supabase moderno, ou HS256)
    header = begin
      JSON.parse(Base64.urlsafe_decode64(token.split('.').first))
    rescue StandardError
      {}
    end
    alg = header['alg'] || 'HS256'

    # 1. Se o token for assimétrico (ES256 / RS256 gerado pelo Supabase moderno)
    if %w[ES256 RS256].include?(alg)
      begin
        return JWT.decode(token, nil, true, { algorithms: %w[ES256 RS256], jwks: supabase_jwks, leeway: 120 })
      rescue StandardError => e
        Rails.logger.warn "[JWKS VERIFY FAILED] #{e.message}. Tentando validação via API Supabase..."
      end
    end

    # 2. Se o token for simétrico (HS256) com o JWT Secret do Supabase
    if ENV['SUPABASE_JWT_SECRET'].present?
      secret = ENV['SUPABASE_JWT_SECRET'].to_s.strip.delete_prefix('"').delete_suffix('"')
      begin
        return JWT.decode(token, secret, true, { algorithm: 'HS256', leeway: 120 })
      rescue JWT::VerificationError => e
        begin
          return JWT.decode(token, Base64.decode64(secret), true, { algorithm: 'HS256', leeway: 120 })
        rescue StandardError
          Rails.logger.warn "[HS256 VERIFY FAILED] #{e.message}. Tentando validação via API Supabase..."
        end
      end
    end

    # 3. Fallback definitivo: Validação oficial direta com a API do Supabase (/auth/v1/user)
    api_claims = validate_with_supabase_api(token)
    return api_claims if api_claims.present?

    # 4. Modo desenvolvimento
    if Rails.env.development?
      return [JWT.decode(token, nil, false)[0] || { 'sub' => 'dev_cuidador_local' }, {}]
    end

    raise JWT::DecodeError, "Assinatura do token (#{alg}) não pôde ser verificada."
  end

  def supabase_jwks
    @supabase_jwks ||= begin
      project_id = ENV.fetch('SUPABASE_PROJECT_ID', 'gqonewnyyjaxwubqxhjg')
      uri = URI("https://#{project_id}.supabase.co/auth/v1/.well-known/jwks.json")
      response = Net::HTTP.get(uri)
      JWT::JWK::Set.new(JSON.parse(response))
    end
  end

  def validate_with_supabase_api(token)
    project_id = ENV.fetch('SUPABASE_PROJECT_ID', 'gqonewnyyjaxwubqxhjg')
    uri = URI("https://#{project_id}.supabase.co/auth/v1/user")
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{token}"
    anon_key = ENV['SUPABASE_ANON_KEY'] || ENV['VITE_SUPABASE_ANON_KEY']
    req['apikey'] = anon_key if anon_key.present?

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 4
    http.read_timeout = 4
    res = http.request(req)

    if res.is_a?(Net::HTTPSuccess)
      user_data = JSON.parse(res.body)
      [{
        'sub' => user_data['id'],
        'email' => user_data['email'],
        'role' => user_data['role'],
        'app_metadata' => user_data['app_metadata'] || {},
        'user_metadata' => user_data['user_metadata'] || {}
      }, { 'alg' => 'SUPABASE_API' }]
    else
      nil
    end
  rescue StandardError => e
    Rails.logger.warn "[SUPABASE AUTH API EXCEPTION] #{e.message}"
    nil
  end

  # Compatibilidade regressiva caso algum controller use o nome antigo
  alias_method :authenticate_clerk_user!, :authenticate_user!
end