class ApplicationController < ActionController::API
  before_action :authenticate_clerk_user!

  attr_reader :current_user_id

  private

  def authenticate_clerk_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header.present?

    return render json: { error: 'Token não fornecido' }, status: :unauthorized unless token

    rsa_public = OpenSSL::PKey::RSA.new(ENV['CLERK_PEM_PUBLIC_KEY'].gsub('\n', "\n"))
    decoded = JWT.decode(token, rsa_public, true, { algorithm: 'RS256' })

    @current_user_id = decoded[0]['sub']
  rescue JWT::DecodeError, JWT::ExpiredSignature
    render json: { error: 'Token inválido ou expirado' }, status: :unauthorized
  rescue OpenSSL::PKey::RSAError
    render json: { error: 'Erro na configuração da chave pública' }, status: :internal_server_error
  end
end