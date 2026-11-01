# frozen_string_literal: true

# ==============================================================================
# SOSqr - Script de Povoamento de Dados (Seeds)
# ==============================================================================
# Execução:
#   bin/rails db:seed                                (Usa 'dev_cuidador_local')
#   TARGET_USER_ID="uuid-do-supabase" bin/rails db:seed (Vincula ao seu usuário)
# ==============================================================================

puts "\n🚀 [SOSqr Seeds] Iniciando povoamento do banco de dados..."

target_user_id = ENV['TARGET_USER_ID'].presence || 'dev_cuidador_local'
puts "👤 Cuidador de destino (user_id): #{target_user_id}"

# 1. Definição de Perfis Clínicos Realistas
sample_patients = [
  {
    full_name: "Antenor Silveira Ramos",
    display_name: "Seu Antenor",
    cpf: "341.890.123-45",
    rg: "4567890-SSP/SP",
    sus_number: "898001234567891",
    birth_date: Date.new(1948, 4, 15),
    blood_type: "O+",
    organ_donor: true,
    gender: "Masculino",
    health_insurance_name: "Bradesco Saúde",
    health_insurance_number: "892019283-01",
    medical_devices: ["Marcapasso Cardíaco (Medtronic 2021)", "Aparelho Auditivo (Ouvido E)"],
    allergies: ["Dipirona (Reação anafilática)", "Iodo / Contraste Radiológico"],
    chronic_conditions: ["Hipertensão Arterial Sistêmica", "Diabetes Mellitus Tipo 2", "Arritmia Cardíaca"],
    medications_in_use: [
      "Losartana Potássica 50mg (1x ao dia às 08h)",
      "Metformina 850mg (2x ao dia após refeições)",
      "AAS 100mg (1x ao dia no almoço)"
    ],
    medical_notes: "Paciente com histórico de síncope postural. Em caso de desmaio, não elevar cabeça bruscamente e checar pulsação.",
    private_notes: "A chave extra da casa fica com a vizinha Dona Clara (Apto 42).",
    contacts: [
      { name: "Mariana Silveira (Filha)", phone_number: "(11) 98765-4321", relationship: "Filha", is_primary: true },
      { name: "Dr. Roberto Calheiros (Cardiologista)", phone_number: "(11) 97123-9988", relationship: "Médico de Confiança", is_primary: false },
      { name: "Clara Mendes (Vizinha)", phone_number: "(11) 96543-2109", relationship: "Vizinha", is_primary: false }
    ],
    scans_count: 5
  },
  {
    full_name: "Beatriz Lins Guimarães",
    display_name: "Bia",
    cpf: "512.743.990-12",
    rg: "5678901-SSP/RJ",
    sus_number: "898007654321098",
    birth_date: Date.new(2017, 10, 22),
    blood_type: "A+",
    organ_donor: false,
    gender: "Feminino",
    health_insurance_name: "Unimed Seguros",
    health_insurance_number: "005492100-99",
    medical_devices: ["Sensor de Glicose Contínua (Freestyle Libre - Braço D)"],
    allergies: ["Amendoim / Nozes (Grave - Risco de Choque)", "Penicilina", "Sulfa"],
    chronic_conditions: ["Diabetes Mellitus Tipo 1", "Asma Brônquica"],
    medications_in_use: [
      "Insulina Glargina 14UI (Às 21h)",
      "Insulina Lispro Ultra-rápida (Correção pós-glicemia)",
      "Aerolin Spray 100mcg (Se crise de falta de ar)"
    ],
    medical_notes: "Criança! Possui caneta de adrenalina autoinjetável (EpiPen) na mochila para emergência alérgica grave.",
    private_notes: "Estuda na Escola Viva, 3º ano B. Professora Célia.",
    contacts: [
      { name: "Carla Lins (Mãe)", phone_number: "(21) 99876-1122", relationship: "Mãe", is_primary: true },
      { name: "Rodrigo Guimarães (Pai)", phone_number: "(21) 99654-3344", relationship: "Pai", is_primary: false }
    ],
    scans_count: 8
  },
  {
    full_name: "Lucas Ferreira de Albuquerque",
    display_name: "Lucas",
    cpf: "789.012.345-67",
    rg: "3456789-SSP/MG",
    sus_number: "898003456789012",
    birth_date: Date.new(1996, 7, 3),
    blood_type: "AB-",
    organ_donor: true,
    gender: "Masculino",
    health_insurance_name: "SulAmérica Especial",
    health_insurance_number: "991002341",
    medical_devices: [],
    allergies: ["Anti-inflamatórios não-esteroidais (Ibuprofeno, Cetoprofeno)"],
    chronic_conditions: ["Epilepsia Mioclônica Juvenil"],
    medications_in_use: [
      "Levetiracetam (Keppra) 750mg (2x ao dia)",
      "Lamotrigina 100mg (1x ao dia)"
    ],
    medical_notes: "Em caso de crise convulsiva: afastar objetos pontiagudos, virar a cabeça para o lado para evitar aspiração e cronometrar duração.",
    private_notes: "Pratica ciclismo de estrada aos sábados pela manhã.",
    contacts: [
      { name: "Amanda Albuquerque (Irmã)", phone_number: "(31) 98877-6655", relationship: "Irmã", is_primary: true },
      { name: "Gabriel Sampaio (Amigo/Ciclismo)", phone_number: "(31) 97766-5544", relationship: "Amigo", is_primary: false }
    ],
    scans_count: 3
  },
  {
    full_name: "Dona Darcy dos Reis Morais",
    display_name: "Dona Darcy",
    cpf: "198.765.432-10",
    rg: "2345678-SSP/CE",
    sus_number: "898009876543210",
    birth_date: Date.new(1940, 12, 1),
    blood_type: "B-",
    organ_donor: false,
    gender: "Feminino",
    health_insurance_name: "Hapvida Saúde",
    health_insurance_number: "778899001",
    medical_devices: ["Prótese Total de Quadril Esquerdo (Metálica)"],
    allergies: ["Frutos do Mar", "Picada de Abelha"],
    chronic_conditions: ["Doença de Alzheimer (Fase Moderada)", "Osteoporose Avançada"],
    medications_in_use: [
      "Donepezila 10mg (1x à noite)",
      "Memantina 20mg (1x pela manhã)",
      "Carbonato de Cálcio + Vitamina D 500mg"
    ],
    medical_notes: "Pode apresentar desorientação têmporo-espacial e não reconhecer o próprio endereço. Conduzir com calma.",
    private_notes: "Reside com a filha Patrícia no Bairro Aldeota.",
    contacts: [
      { name: "Patrícia Morais (Filha / Tutora)", phone_number: "(85) 99112-2334", relationship: "Filha", is_primary: true },
      { name: "Enfermeira Roseli (Cuidadora Diurna)", phone_number: "(85) 98822-4455", relationship: "Cuidadora", is_primary: false }
    ],
    scans_count: 12
  }
]

# 2. Inserção Idempotente dos Registros
sample_patients.each_with_index do |data, index|
  contacts_data = data.delete(:contacts)
  scans_count = data.delete(:scans_count)

  # Busca ou inicializa pelo CPF e pelo user_id
  patient = Patient.find_or_initialize_by(cpf: data[:cpf])
  patient.assign_attributes(data.merge(
    user_id: target_user_id,
    clerk_user_id: target_user_id
  ))

  if patient.save
    puts "  [OK] Paciente: #{patient.full_name} (#{patient.display_name}) - Token: #{patient.public_token}"

    # Contatos de Emergência
    contacts_data.each do |c_attrs|
      contact = patient.emergency_contacts.find_or_initialize_by(
        name: c_attrs[:name],
        relationship: c_attrs[:relationship]
      )
      contact.assign_attributes(c_attrs)
      contact.save!
    end
    puts "       └── #{patient.emergency_contacts.count} contatos de emergência sincronizados."

    # Logs de Escaneamento Simulados (alimenta o Dashboard Admin)
    simulated_agents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 (Samu-Mobile-App)"
    ]

    current_scans = patient.scan_logs.count
    needed_scans = [scans_count - current_scans, 0].max

    needed_scans.times do |i|
      # Simula escaneamentos nos últimos 15 dias, incluindo hoje
      hours_ago = rand(1..360)
      patient.scan_logs.create!(
        ip_address: "189.#{rand(10..250)}.#{rand(1..254)}.#{rand(1..254)}",
        user_agent: simulated_agents.sample,
        scanned_at: hours_ago.hours.ago,
        created_at: hours_ago.hours.ago
      )
    end
    puts "       └── #{patient.scan_logs.count} registros de escaneamento configurados."
  else
    puts "  ❌ [ERRO] Falha ao salvar #{data[:full_name]}: #{patient.errors.full_messages.join(', ')}"
  end
end

puts "\n✨ [SOSqr Seeds] Concluído com sucesso!"
puts "📊 Total de Pacientes na Base: #{Patient.count}"
puts "📞 Total de Contatos de Emergência: #{EmergencyContact.count}"
puts "🔍 Total de Escaneamentos Registrados: #{ScanLog.count}"
puts "==============================================================================\n"
