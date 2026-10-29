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

    # 2. Decodificação do Token
    decoded = begin
      if ENV['SUPABASE_JWT_SECRET'].present?
        secret = ENV['SUPABASE_JWT_SECRET'].to_s.strip.delete_prefix('"').delete_suffix('"')
        begin
          JWT.decode(token, secret, true, { algorithm: 'HS256', leeway: 120 })
        rescue JWT::VerificationError => e
          # Tenta decodificar a chave em Base64 se a verificação crua falhar
          begin
            JWT.decode(token, Base64.decode64(secret), true, { algorithm: 'HS256', leeway: 120 })
          rescue StandardError
            raise e
          end
        end
      elsif ENV['CLERK_PEM_PUBLIC_KEY'].present?
        rsa_public = OpenSSL::PKey::RSA.new(ENV['CLERK_PEM_PUBLIC_KEY'].gsub('\n', "\n"))
        JWT.decode(token, rsa_public, true, { algorithm: 'RS256', leeway: 120 })
      elsif Rails.env.development?
        JWT.decode(token, nil, false)
      else
        render json: { error: 'Chave de autenticação (SUPABASE_JWT_SECRET) não configurada no servidor' }, status: :internal_server_error
        return
      end
    rescue JWT::DecodeError, JWT::ExpiredSignature => e
      Rails.logger.warn "[AUTH ERROR] Falha na validação do token JWT: #{e.class} - #{e.message}"
      if Rails.env.development?
        # Em desenvolvimento, se o token expirou ou a assinatura divergiu (ex: cookies antigos do navegador),
        # decodifica os dados sem travar o desenvolvedor com status 401
        Rails.logger.warn "[AUTH DEV] Aviso: #{e.class} (#{e.message}). Permitindo acesso em modo desenvolvimento."
        begin
          JWT.decode(token, nil, false)
        rescue StandardError
          [{ 'sub' => 'dev_cuidador_local' }, {}]
        end
      else
        raise e
      end
    end

    @claims = decoded[0] || {}
    @jwt_claims = @claims
    @current_user_id = @claims['sub'].presence || 'dev_cuidador_local'
    @current_user_role = @claims.dig('app_metadata', 'role') ||
                         @claims.dig('user_metadata', 'role') ||
                         @claims['role'] ||
                         (Rails.env.development? ? 'admin' : nil)
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    render json: { error: 'Token inválido ou expirado', details: e.message }, status: :unauthorized
  rescue StandardError => e
    render json: { error: 'Erro ao validar autenticação', details: e.message }, status: :internal_server_error
  end

  # Compatibilidade regressiva caso algum controller use o nome antigo
  alias_method :authenticate_clerk_user!, :authenticate_user!
end