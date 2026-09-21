import { useState, useEffect, type FC } from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { api } from '../services/api';

export interface PatientToDelete {
  id: number;
  full_name: string;
}

interface DeletePatientModalProps {
  isOpen: boolean;
  patient: PatientToDelete | null;
  onClose: () => void;
  onSuccess: (deletedPatientId: number, patientName: string) => void;
}

export const DeletePatientModal: FC<DeletePatientModalProps> = ({
  isOpen,
  patient,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setErrorMessage(null);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !patient) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await api.delete(`/patients/${patient.id}`);
      onSuccess(patient.id, patient.full_name);
      onClose();
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const msg =
        axiosError.response?.data?.error ||
        'Não foi possível excluir o prontuário. Verifique sua conexão e tente novamente.';
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-patient-title"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3
            id="delete-patient-title"
            className="text-xl font-black text-stone-900 tracking-tight"
          >
            Excluir perfil de emergência?
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Tem certeza de que deseja excluir os dados de{' '}
            <strong className="text-stone-900 font-bold">{patient.full_name}</strong>?
            Esta ação é irreversível e o QR Code do cartão deixará de funcionar imediatamente
            caso seja escaneado em uma emergência.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir Perfil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatientModal;
