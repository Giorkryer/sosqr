import type { FC } from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

export interface EmergencyContact {
  id?: number;
  name: string;
  phone_number: string;
  relationship: string;
  is_primary?: boolean;
}

export interface CardPatientData {
  id: number;
  public_token: string;
  display_name: string;
  full_name: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  blood_type: string;
  allergies?: string[];
  chronic_conditions?: string[];
  medications_in_use?: string[];
  medical_devices?: string[];
  health_insurance_name?: string;
  health_insurance_number?: string;
  emergency_contacts?: EmergencyContact[];
}

const formatDateBR = (dateStr?: string): string => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

// Estilos de impressão vetoriais em dimensões CR80 (85.6mm x 53.98mm)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B6651',
    marginBottom: 4,
  },
  docSubtitle: {
    fontSize: 9,
    color: '#57534E',
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
  },
  cardWrapper: {
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#78716C',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  // Dimensões CR80 oficiais: 85.6mm x 53.98mm (~242.6pt x 153pt)
  cr80Card: {
    width: 242.6,
    height: 153,
    backgroundColor: '#F3EFE6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardTopBar: {
    backgroundColor: '#0B6651',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topBarLogoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topBarRight: {
    alignItems: 'flex-end',
  },
  topBarTitle: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  topBarSubtitle: {
    fontSize: 6,
    color: '#CCFBF1',
  },
  frontBody: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  frontLeftCol: {
    width: 140,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1C1917',
    textTransform: 'uppercase',
    lineHeight: 1.2,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#292524',
    marginBottom: 2,
  },
  fallbackLinkBox: {
    marginTop: 6,
  },
  fallbackLabel: {
    fontSize: 6,
    color: '#78716C',
    marginBottom: 1,
  },
  fallbackUrl: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#0B6651',
    textDecoration: 'underline',
  },
  qrContainer: {
    width: 68,
    height: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0B6651',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  qrImage: {
    width: 62,
    height: 62,
  },
  backTopBar: {
    backgroundColor: '#0B6651',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTopBarTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backBody: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backQrContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginBottom: 4,
  },
  backQrImage: {
    width: 60,
    height: 60,
  },
  backInstruction: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#1C1917',
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  backContactFooter: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#1C1917',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
  },
});

interface EmergencyCardDocumentProps {
  patient: CardPatientData;
  qrDataUrl?: string;
}

export const EmergencyCardDocument: FC<EmergencyCardDocumentProps> = ({ patient, qrDataUrl }) => {
  const primaryContact =
    patient.emergency_contacts?.find((c) => c.is_primary) ||
    patient.emergency_contacts?.[0];

  const birthDateFormatted = formatDateBR(patient.birth_date);
  const tokenShort = patient.public_token ? patient.public_token.slice(0, 8) : 'demo';

  return (
    <Document title={`Cartao_SOSqr_${patient.display_name || 'Perfil'}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.docTitle}>SOSqr &bull; Emissão de Cartão Físico de Emergência</Text>
        <Text style={styles.docSubtitle}>
          Padrão Oficial CR80 (85,60 mm x 53,98 mm) em alta resolução vetorial para corte, laminação ou impressão direta em PVC.
        </Text>

        <View style={styles.cardsRow}>
          <View style={styles.cardWrapper}>
            <Text style={styles.cardLabel}>Frente do Cartão</Text>
            <View style={styles.cr80Card}>
              <View style={styles.cardTopBar}>
                <View style={styles.topBarLeft}>
                  <Text style={styles.topBarLogoText}>SOSqr</Text>
                </View>
                <View style={styles.topBarRight}>
                  <Text style={styles.topBarTitle}>EMERGÊNCIA MÉDICA</Text>
                  <Text style={styles.topBarSubtitle}>Escaneie para dados vitais</Text>
                </View>
              </View>

              <View style={styles.frontBody}>
                <View style={styles.frontLeftCol}>
                  <Text style={styles.patientName}>
                    {patient.full_name || patient.display_name}
                  </Text>
                  {birthDateFormatted && (
                    <Text style={styles.metaText}>Nasc: {birthDateFormatted}</Text>
                  )}
                  <Text style={styles.metaText}>Sangue: {patient.blood_type || 'O+'} [ALERTA]</Text>

                  <View style={styles.fallbackLinkBox}>
                    <Text style={styles.fallbackLabel}>Acesso rápido via link:</Text>
                    <Text style={styles.fallbackUrl}>sosqr.com.br/{tokenShort}</Text>
                  </View>
                </View>

                <View style={styles.qrContainer}>
                  {qrDataUrl ? (
                    <Image src={qrDataUrl} style={styles.qrImage} />
                  ) : (
                    <Text style={{ fontSize: 7, color: '#78716C' }}>QR Code</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardWrapper}>
            <Text style={styles.cardLabel}>Verso do Cartão</Text>
            <View style={styles.cr80Card}>
              <View style={styles.backTopBar}>
                <Text style={styles.backTopBarTitle}>MAIS INFORMAÇÕES</Text>
              </View>

              <View style={styles.backBody}>
                <View style={styles.backQrContainer}>
                  {qrDataUrl ? (
                    <Image src={qrDataUrl} style={styles.backQrImage} />
                  ) : (
                    <Text style={{ fontSize: 7, color: '#78716C' }}>QR Code</Text>
                  )}
                </View>

                <Text style={styles.backInstruction}>APONTE A CÂMERA DO CELULAR</Text>
                <Text style={styles.backInstruction}>PARA VER A FICHA MÉDICA</Text>

                <Text style={styles.backContactFooter}>
                  CONTATO DE EMERGÊNCIA: {primaryContact?.phone_number || '(85) 99123-4567'}
                  {primaryContact?.name ? ` (${primaryContact.name})` : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EmergencyCardDocument;
