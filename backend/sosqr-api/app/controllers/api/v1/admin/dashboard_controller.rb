module Api
  module V1
    module Admin
      class DashboardController < AdminBaseController
        def show
          total_patients = Patient.count
          total_scans = ScanLog.count
          total_caregivers = Patient.distinct.count(:clerk_user_id)

          recent_scans = ScanLog.includes(:patient).order(created_at: :desc).limit(10).map do |log|
            {
              id: log.id,
              patient_id: log.patient_id,
              patient_name: log.patient&.full_name || log.patient&.display_name || 'Paciente',
              public_token: log.patient&.public_token,
              ip_address: log.ip_address,
              user_agent: log.user_agent,
              scanned_at: log.scanned_at || log.created_at
            }
          end

          render json: {
            kpis: {
              total_patients: total_patients,
              total_scans: total_scans,
              total_caregivers: total_caregivers
            },
            recent_scans: recent_scans
          }
        end
      end
    end
  end
end
