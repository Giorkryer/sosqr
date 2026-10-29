module Api
  module V1
    module Admin
      class DashboardController < Api::V1::Admin::BaseController
        def index
          total_patients = Patient.count
          total_scans = ScanLog.count
          caregiver_col = Patient.column_names.include?('user_id') ? :user_id : :clerk_user_id
          total_caregivers = Patient.distinct.count(caregiver_col)
          scans_today = ScanLog.where('scanned_at >= ?', Time.current.beginning_of_day).count

          recent_scans = ScanLog.includes(:patient)
                                .order(scanned_at: :desc)
                                .limit(50)
                                .map do |scan_log|
            {
              id: scan_log.id,
              patient_id: scan_log.patient_id,
              patient_name: scan_log.patient&.full_name.presence || "Perfil Desativado",
              public_token: scan_log.patient&.public_token,
              scanned_at: (scan_log.scanned_at || scan_log.created_at)&.iso8601,
              ip_address: mask_ip(scan_log.ip_address),
              user_agent: scan_log.user_agent.to_s
            }
          end

          render json: {
            total_patients: total_patients,
            total_scans: total_scans,
            total_caregivers: total_caregivers,
            scans_today: scans_today,
            kpis: {
              total_patients: total_patients,
              total_scans: total_scans,
              total_caregivers: total_caregivers,
              scans_today: scans_today
            },
            recent_scans: recent_scans
          }
        end

        alias_method :show, :index

        private

        def mask_ip(ip)
          return '***.***' if ip.blank?

          ip_str = ip.to_s.strip
          if ip_str.include?('.')
            octets = ip_str.split('.')
            if octets.size == 4
              "#{octets[0]}.#{octets[1]}.***.***"
            else
              "#{octets.first(2).join('.')}.***.***"
            end
          elsif ip_str.include?(':')
            segments = ip_str.split(':')
            if segments.size > 2
              "#{segments.first(2).join(':')}:****:****"
            else
              '****:****'
            end
          else
            '***.***'
          end
        end
      end
    end
  end
end
