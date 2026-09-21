import type { FC } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import type { EmergencyContact } from '../types';
import type { ContactRelationship } from '../../../types';
import { Input } from '../../../components/ui/Input';

interface ContactsNestedFormProps {
  contacts: EmergencyContact[];
  onChange: (contacts: EmergencyContact[]) => void;
}

const RELATIONSHIPS: ContactRelationship[] = [
  'Filho(a)',
  'Cônjuge',
  'Irmão/Irmã',
  'Neto(a)',
  'Cuidador(a)',
  'Médico(a)',
  'Vizinho(a)',
  'Outro',
];

export const ContactsNestedForm: FC<ContactsNestedFormProps> = ({
  contacts,
  onChange,
}) => {
  const addContact = () => {
    onChange([
      ...contacts,
      {
        name: '',
        relationship: 'Filho(a)',
        phone_number: '',
        is_primary: contacts.length === 0,
      },
    ]);
  };

  const removeContact = (index: number) => {
    const updated = contacts.filter((_, idx) => idx !== index);
    // Se o contato principal foi removido, define o primeiro como principal
    if (updated.length > 0 && !updated.some((c) => c.is_primary)) {
      updated[0].is_primary = true;
    }
    onChange(updated);
  };

  const updateContact = (
    index: number,
    field: keyof EmergencyContact,
    value: string | boolean
  ) => {
    const updated = [...contacts];
    if (field === 'is_primary' && value === true) {
      // Garante unicidade do contato principal
      updated.forEach((c, idx) => {
        c.is_primary = idx === index;
      });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Contatos de Emergência</h3>
          <p className="text-xs text-stone-600">
            Cadastre os telefones de familiares ou socorristas a serem contatados.
          </p>
        </div>
        <button
          type="button"
          onClick={addContact}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-teal-50 text-teal-800 border border-teal-700/20 rounded-xl hover:bg-teal-100"
        >
          <Plus className="w-4 h-4" />
          Adicionar Contato
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="p-6 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl text-center text-stone-600 text-sm">
          Nenhum contato adicionado. Clique no botão acima para adicionar contatos de socorro.
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Contato #{index + 1}
                </span>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="primary_contact"
                      checked={contact.is_primary}
                      onChange={() => updateContact(index, 'is_primary', true)}
                      className="text-emerald-600 focus:ring-emerald-600"
                    />
                    <Star
                      className={`w-3.5 h-3.5 ${
                        contact.is_primary ? 'text-emerald-600 fill-emerald-600' : 'text-stone-400'
                      }`}
                    />
                    Principal
                  </label>

                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="text-stone-400 hover:text-rose-500 p-1"
                    title="Remover contato"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Nome Completo"
                  placeholder="Ex: Carlos Eduardo"
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                />

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-base font-semibold text-stone-900">
                    Parentesco / Vínculo
                  </label>
                  <select
                    value={contact.relationship}
                    onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                    className="w-full px-4 py-3 min-h-[48px] text-base rounded-xl border-2 border-stone-200 bg-white text-stone-900 focus:border-teal-700 focus:outline-none"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Telefone com DDD"
                  placeholder="(11) 98765-4321"
                  value={contact.phone_number}
                  onChange={(e) => updateContact(index, 'phone_number', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
