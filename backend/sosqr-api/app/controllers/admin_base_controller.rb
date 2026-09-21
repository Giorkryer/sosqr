class AdminBaseController < ApplicationController
  before_action :require_admin!

  private

  def require_admin!
    # Validação de acesso administrativo
    render json: { error: 'Acesso restrito a administradores' }, status: :forbidden unless current_user_id.present?
  end
end
