module Api
  module V1
    class EmergencyProfilesController < ApplicationController
      skip_before_action :authenticate_clerk_user!, only: [:show], raise: false

      def show
        patient = Patient.includes(:emergency_contacts).find_by!(public_token: params[:public_token])

        patient.scan_logs.create(
          ip_address: request.remote_ip,
          user_agent: request.user_agent,
          scanned_at: Time.current
        )

        render json: {
          public_token: patient.public_token,
          display_name: patient.display_name,
          full_name: patient.full_name,
          age: patient.age,
          birth_date: patient.birth_date,
          gender: patient.gender,
          blood_type: patient.blood_type,
          organ_donor: patient.organ_donor,
          medical_notes: patient.medical_notes,
          medical_devices: patient.medical_devices || [],
          health_insurance_name: patient.health_insurance_name,
          health_insurance_number: patient.health_insurance_number,
          allergies: patient.allergies || [],
          chronic_conditions: patient.chronic_conditions || [],
          medications_in_use: patient.medications_in_use || [],
          emergency_contacts: patient.emergency_contacts.map { |c|
            {
              name: c.name,
              phone_number: c.phone_number,
              relationship: c.relationship,
              is_primary: c.is_primary
            }
          }
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Ficha de emergência não encontrada' }, status: :not_found
      end
    end
  end
end