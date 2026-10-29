module Api
  module V1
    module Admin
      class BaseController < ApplicationController
        before_action :require_admin!

        private

        def require_admin!
          return if admin_authorized?

          render json: { error: "Acesso não autorizado ao painel administrativo." }, status: :forbidden
        end

        def admin_authorized?
          admin_by_claims? || admin_by_env?
        end

        def admin_by_claims?
          return false unless claims.is_a?(Hash)

          claims.dig('app_metadata', 'role') == 'admin' ||
            claims.dig('user_metadata', 'role') == 'admin' ||
            claims['role'] == 'admin' ||
            claims.dig('metadata', 'role') == 'admin' ||
            claims.dig('public_metadata', 'role') == 'admin'
        end

        def admin_by_env?
          return false if @current_user_id.blank?

          admin_ids = "#{ENV['ADMIN_USER_IDS']},#{ENV['ADMIN_SUPABASE_IDS']},#{ENV['ADMIN_CLERK_IDS']}"
                      .split(',').map(&:strip).reject(&:blank?)
          admin_ids.include?(@current_user_id)
        end
      end
    end
  end
end
