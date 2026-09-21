module Api
  module V1
    class PatientsController < ApplicationController
      before_action :set_patient, only: [:show, :update, :destroy]

      def index
        @patients = Patient.where(clerk_user_id: @current_user_id)
                           .includes(:emergency_contacts, :scan_logs)
        render json: @patients.as_json(include: :emergency_contacts, methods: [:last_scan, :age]), status: :ok
      end

      def show
        render json: @patient.as_json(include: :emergency_contacts, methods: [:last_scan, :age]), status: :ok
      end

      def create
        @patient = Patient.new(patient_params)
        @patient.clerk_user_id = @current_user_id

        if @patient.save
          render json: @patient, status: :created
        else
          render json: { errors: @patient.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @patient.update(patient_params)
          render json: @patient, status: :ok
        else
          render json: { errors: @patient.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @patient.destroy
        head :no_content
      end

      private

      def set_patient
        @patient = Patient.find_by!(id: params[:id], clerk_user_id: @current_user_id)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Paciente não encontrado ou acesso não autorizado' }, status: :not_found
      end

      def patient_params
        params.require(:patient).permit(
          :display_name, :full_name, :cpf, :rg, :sus_number, :birth_date,
          :blood_type, :organ_donor, :private_notes, :medical_notes,
          :gender, :health_insurance_name, :health_insurance_number,
          allergies: [], chronic_conditions: [], medications_in_use: [], medical_devices: [],
          emergency_contacts_attributes: [:id, :name, :phone_number, :relationship, :is_primary, :_destroy]
        )
      end
    end
  end
end