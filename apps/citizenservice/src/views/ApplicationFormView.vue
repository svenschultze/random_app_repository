<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const serviceId = route.params.id

// Form state
const currentStep = ref(0)
const maxStepVisited = ref(0)
const formComplete = ref(false)
const formData = ref({
  personalData: {
    salutation: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: ''
  },
  serviceSpecific: {
    // This will be populated based on the service type
  },
  documents: {
    files: []
  },
  confirmation: {
    agreeToTerms: false,
    agreeToDataProcessing: false
  }
})

// Tracks the fields that have been touched for validation
const touchedFields = ref({
  personalData: {},
  serviceSpecific: {},
  documents: {},
  confirmation: {}
})

// This would come from an API in a real application
const serviceDetails = ref({
  'id-card': {
    id: 'id-card',
    title: 'Personalausweis',
    description: 'Beantragen oder Verlängern Sie Ihren Personalausweis',
    icon: '📇',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Ausweisdetails',
        description: 'Bitte geben Sie die Details für Ihren Personalausweis an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'isFirstApplication',
            label: 'Ist dies Ihr erster Personalausweis?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true
          },
          {
            name: 'reasonForApplication',
            label: 'Grund für die Beantragung',
            type: 'select',
            options: [
              { value: 'new', label: 'Erstausstellung' },
              { value: 'renewal', label: 'Verlängerung' },
              { value: 'replacement', label: 'Ersatz bei Verlust' },
              { value: 'change', label: 'Änderung der Daten' }
            ],
            required: true
          },
          {
            name: 'pickupMethod',
            label: 'Wie möchten Sie den Ausweis abholen?',
            type: 'radio',
            options: [
              { value: 'office', label: 'Persönlich im Amt' },
              { value: 'mail', label: 'Per Post (zusätzliche Gebühren fallen an)' }
            ],
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'photo',
            label: 'Biometrisches Passfoto',
            description: 'Ein aktuelles biometrisches Passfoto (nicht älter als 6 Monate).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'idCard',
            label: 'Aktueller Personalausweis',
            description: 'Scan Ihres aktuellen Personalausweises (bei Verlängerung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'reasonForApplication',
            conditionalValue: ['renewal', 'change']
          },
          {
            name: 'birthCertificate',
            label: 'Geburtsurkunde',
            description: 'Scan Ihrer Geburtsurkunde (bei Erstausstellung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'reasonForApplication',
            conditionalValue: ['new']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'buergergeld': {
    id: 'buergergeld',
    title: 'Bürgergeld',
    description: 'Beantragen Sie finanzielle Unterstützung bei Arbeitslosigkeit oder niedrigem Einkommen',
    icon: '💶',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Einkommenssituation',
        description: 'Bitte geben Sie Informationen zu Ihrer finanziellen Situation an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'employmentStatus',
            label: 'Beschäftigungsstatus',
            type: 'select',
            options: [
              { value: 'unemployed', label: 'Arbeitslos' },
              { value: 'employed', label: 'Beschäftigt mit geringem Einkommen' },
              { value: 'selfemployed', label: 'Selbstständig mit geringem Einkommen' },
              { value: 'student', label: 'Student' },
              { value: 'other', label: 'Sonstiges' }
            ],
            required: true
          },
          {
            name: 'unemploymentDuration',
            label: 'Wie lange sind Sie bereits arbeitslos?',
            type: 'select',
            options: [
              { value: 'lessThan3', label: 'Weniger als 3 Monate' },
              { value: '3to6', label: '3 bis 6 Monate' },
              { value: '6to12', label: '6 bis 12 Monate' },
              { value: 'moreThan12', label: 'Mehr als 12 Monate' }
            ],
            required: false,
            conditionalField: 'employmentStatus',
            conditionalValue: ['unemployed']
          },
          {
            name: 'monthlyIncome',
            label: 'Monatliches Nettoeinkommen (in Euro)',
            type: 'number',
            required: true
          },
          {
            name: 'householdMembers',
            label: 'Anzahl der Personen im Haushalt',
            type: 'number',
            required: true
          },
          {
            name: 'housingCost',
            label: 'Monatliche Wohnkosten (Miete inkl. Nebenkosten)',
            type: 'number',
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'bankStatements',
            label: 'Kontoauszüge',
            description: 'Kontoauszüge der letzten 3 Monate.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'rentContract',
            label: 'Mietvertrag',
            description: 'Aktueller Mietvertrag oder Nachweis über Wohnkosten.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'incomeProof',
            label: 'Einkommensnachweis',
            description: 'Gehaltsabrechnungen der letzten 3 Monate (falls vorhanden).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'employmentStatus',
            conditionalValue: ['employed', 'selfemployed']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'id-card': {
    id: 'id-card',
    title: 'Personalausweis',
    description: 'Beantragen oder Verlängern Sie Ihren Personalausweis',
    icon: '📇',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Ausweisdetails',
        description: 'Bitte geben Sie die Details für Ihren Personalausweis an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'isFirstApplication',
            label: 'Ist dies Ihr erster Personalausweis?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true
          },
          {
            name: 'reasonForApplication',
            label: 'Grund für die Beantragung',
            type: 'select',
            options: [
              { value: 'new', label: 'Erstausstellung' },
              { value: 'renewal', label: 'Verlängerung' },
              { value: 'replacement', label: 'Ersatz bei Verlust' },
              { value: 'change', label: 'Änderung der Daten' }
            ],
            required: true
          },
          {
            name: 'pickupMethod',
            label: 'Wie möchten Sie den Ausweis abholen?',
            type: 'radio',
            options: [
              { value: 'office', label: 'Persönlich im Amt' },
              { value: 'mail', label: 'Per Post (zusätzliche Gebühren fallen an)' }
            ],
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'photo',
            label: 'Biometrisches Passfoto',
            description: 'Ein aktuelles biometrisches Passfoto (nicht älter als 6 Monate).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'idCard',
            label: 'Aktueller Personalausweis',
            description: 'Scan Ihres aktuellen Personalausweises (bei Verlängerung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'reasonForApplication',
            conditionalValue: ['renewal', 'change']
          },
          {
            name: 'birthCertificate',
            label: 'Geburtsurkunde',
            description: 'Scan Ihrer Geburtsurkunde (bei Erstausstellung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'reasonForApplication',
            conditionalValue: ['new']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'passport': {
    id: 'passport',
    title: 'Reisepass',
    description: 'Beantragen oder Verlängern Sie Ihren Reisepass für weltweites Reisen',
    icon: '🛂',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Passdetails',
        description: 'Bitte geben Sie die Details für Ihren Reisepass an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'reasonForApplication',
            label: 'Grund für die Beantragung',
            type: 'select',
            options: [
              { value: 'new', label: 'Erstausstellung' },
              { value: 'renewal', label: 'Verlängerung' },
              { value: 'replacement', label: 'Ersatz bei Verlust' },
              { value: 'change', label: 'Änderung der Daten' }
            ],
            required: true
          },
          {
            name: 'passportType',
            label: 'Art des Reisepasses',
            type: 'select',
            options: [
              { value: 'standard', label: 'Standard Reisepass (32 Seiten)' },
              { value: 'large', label: 'Reisepass mit 48 Seiten' },
              { value: 'express', label: 'Express-Reisepass' }
            ],
            required: true
          },
          {
            name: 'travelPlanned',
            label: 'Ist eine Reise geplant?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true
          },
          {
            name: 'travelDate',
            label: 'Geplantes Reisedatum',
            type: 'text',
            required: false,
            conditionalField: 'travelPlanned',
            conditionalValue: ['yes']
          },
          {
            name: 'pickupMethod',
            label: 'Wie möchten Sie den Pass abholen?',
            type: 'radio',
            options: [
              { value: 'office', label: 'Persönlich im Amt' },
              { value: 'mail', label: 'Per Post (zusätzliche Gebühren fallen an)' }
            ],
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'photo',
            label: 'Biometrisches Passfoto',
            description: 'Ein aktuelles biometrisches Passfoto (nicht älter als 6 Monate).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'oldPassport',
            label: 'Alter Reisepass',
            description: 'Scan Ihres aktuellen Reisepasses (bei Verlängerung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'reasonForApplication',
            conditionalValue: ['renewal', 'change']
          },
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'birthCertificate',
            label: 'Geburtsurkunde',
            description: 'Scan Ihrer Geburtsurkunde (bei Erstausstellung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'reasonForApplication',
            conditionalValue: ['new']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'address-change': {
    id: 'address-change',
    title: 'Ummeldung',
    description: 'Melden Sie Ihren neuen Wohnsitz an oder um',
    icon: '🏠',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Umzugsdetails',
        description: 'Bitte geben Sie die Details zu Ihrem Umzug an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'moveType',
            label: 'Art der Ummeldung',
            type: 'select',
            options: [
              { value: 'withinCity', label: 'Umzug innerhalb der Stadt' },
              { value: 'fromOtherCity', label: 'Zuzug aus einer anderen Stadt' },
              { value: 'fromAbroad', label: 'Zuzug aus dem Ausland' }
            ],
            required: true
          },
          {
            name: 'moveDate',
            label: 'Datum des Umzugs',
            type: 'text',
            required: true
          },
          {
            name: 'previousAddress',
            label: 'Bisherige Adresse',
            type: 'text',
            required: true
          },
          {
            name: 'familyMembers',
            label: 'Ziehen weitere Familienmitglieder mit um?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true
          },
          {
            name: 'numberOfFamilyMembers',
            label: 'Anzahl der umziehenden Familienmitglieder',
            type: 'number',
            required: false,
            conditionalField: 'familyMembers',
            conditionalValue: ['yes']
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'housingConfirmation',
            label: 'Wohnungsgeberbestätigung',
            description: 'Die vom Vermieter oder Eigentümer ausgefüllte Wohnungsgeberbestätigung.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'rentalContract',
            label: 'Mietvertrag',
            description: 'Scan Ihres neuen Mietvertrags.',
            formats: ['jpg', 'png', 'pdf'],
            required: false
          },
          {
            name: 'familyDocuments',
            label: 'Dokumente der Familienmitglieder',
            description: 'Personalausweise oder Geburtsurkunden der umziehenden Familienmitglieder.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'familyMembers',
            conditionalValue: ['yes']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'vehicle-registration': {
    id: 'vehicle-registration',
    title: 'Kfz-Zulassung',
    description: 'Registrieren Sie Ihr Fahrzeug oder ändern Sie die Zulassung',
    icon: '🚗',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Fahrzeugdaten',
        description: 'Bitte geben Sie die Details zu Ihrem Fahrzeug an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'registrationType',
            label: 'Art der Zulassung',
            type: 'select',
            options: [
              { value: 'new', label: 'Neuzulassung' },
              { value: 'transfer', label: 'Umschreibung' },
              { value: 'reregistration', label: 'Wiederzulassung' },
              { value: 'change', label: 'Änderung der Fahrzeugdaten' }
            ],
            required: true
          },
          {
            name: 'vehicleType',
            label: 'Fahrzeugart',
            type: 'select',
            options: [
              { value: 'car', label: 'Pkw' },
              { value: 'motorcycle', label: 'Motorrad' },
              { value: 'truck', label: 'Lkw' },
              { value: 'other', label: 'Sonstiges' }
            ],
            required: true
          },
          {
            name: 'manufacturer',
            label: 'Hersteller',
            type: 'text',
            required: true
          },
          {
            name: 'model',
            label: 'Modell',
            type: 'text',
            required: true
          },
          {
            name: 'licensePlateType',
            label: 'Kennzeichenart',
            type: 'select',
            options: [
              { value: 'standard', label: 'Standardkennzeichen' },
              { value: 'seasonal', label: 'Saisonkennzeichen' },
              { value: 'customized', label: 'Wunschkennzeichen' }
            ],
            required: true
          },
          {
            name: 'desiredPlate',
            label: 'Wunschkennzeichen (falls gewünscht)',
            type: 'text',
            required: false,
            conditionalField: 'licensePlateType',
            conditionalValue: ['customized']
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'vehicleCertificate',
            label: 'Fahrzeugschein/Zulassungsbescheinigung Teil I',
            description: 'Scan der Zulassungsbescheinigung Teil I (bei Umschreibung).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'registrationType',
            conditionalValue: ['transfer', 'change', 'reregistration']
          },
          {
            name: 'vehicleTitle',
            label: 'Fahrzeugbrief/Zulassungsbescheinigung Teil II',
            description: 'Scan der Zulassungsbescheinigung Teil II.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'insurance',
            label: 'Versicherungsnachweis (eVB-Nummer)',
            description: 'Elektronische Versicherungsbestätigungsnummer.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'tuv',
            label: 'HU/TÜV-Bescheinigung',
            description: 'Nachweis über die Hauptuntersuchung.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'birth-certificate': {
    id: 'birth-certificate',
    title: 'Geburtsurkunde',
    description: 'Beantragen Sie eine Geburtsurkunde',
    icon: '👶',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Urkundendetails',
        description: 'Bitte geben Sie die Details für die Geburtsurkunde an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'requestType',
            label: 'Art der Beantragung',
            type: 'select',
            options: [
              { value: 'self', label: 'Für mich selbst' },
              { value: 'child', label: 'Für mein Kind' },
              { value: 'other', label: 'Für eine andere Person' }
            ],
            required: true
          },
          {
            name: 'birthDate',
            label: 'Geburtsdatum der Person',
            type: 'text',
            required: true
          },
          {
            name: 'birthPlace',
            label: 'Geburtsort',
            type: 'text',
            required: true
          },
          {
            name: 'certificateType',
            label: 'Art der Geburtsurkunde',
            type: 'select',
            options: [
              { value: 'standard', label: 'Standard Geburtsurkunde' },
              { value: 'international', label: 'Internationale Geburtsurkunde' },
              { value: 'certified', label: 'Beglaubigte Abschrift aus dem Geburtenregister' }
            ],
            required: true
          },
          {
            name: 'numberOfCopies',
            label: 'Anzahl der Kopien',
            type: 'number',
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'authorization',
            label: 'Vollmacht',
            description: 'Eine Vollmacht der Person, für die Sie die Urkunde beantragen.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'requestType',
            conditionalValue: ['other']
          },
          {
            name: 'relationshipProof',
            label: 'Nachweis des Verwandtschaftsverhältnisses',
            description: 'Dokument, das Ihr Verwandtschaftsverhältnis belegt.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'requestType',
            conditionalValue: ['child', 'other']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'marriage-certificate': {
    id: 'marriage-certificate',
    title: 'Eheurkunde',
    description: 'Beantragen Sie eine Eheurkunde',
    icon: '💍',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Urkundendetails',
        description: 'Bitte geben Sie die Details für die Eheurkunde an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'requestType',
            label: 'Art der Beantragung',
            type: 'select',
            options: [
              { value: 'self', label: 'Für meine eigene Ehe' },
              { value: 'other', label: 'Für eine andere Person' }
            ],
            required: true
          },
          {
            name: 'marriageDate',
            label: 'Datum der Eheschließung',
            type: 'text',
            required: true
          },
          {
            name: 'marriagePlace',
            label: 'Ort der Eheschließung',
            type: 'text',
            required: true
          },
          {
            name: 'spouseName',
            label: 'Name des Ehepartners/der Ehepartnerin',
            type: 'text',
            required: true
          },
          {
            name: 'certificateType',
            label: 'Art der Eheurkunde',
            type: 'select',
            options: [
              { value: 'standard', label: 'Standard Eheurkunde' },
              { value: 'international', label: 'Internationale Eheurkunde' },
              { value: 'certified', label: 'Beglaubigte Abschrift aus dem Eheregister' }
            ],
            required: true
          },
          {
            name: 'numberOfCopies',
            label: 'Anzahl der Kopien',
            type: 'number',
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'authorization',
            label: 'Vollmacht',
            description: 'Eine Vollmacht der Person, für die Sie die Urkunde beantragen.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'requestType',
            conditionalValue: ['other']
          },
          {
            name: 'relationshipProof',
            label: 'Nachweis des Verwandtschaftsverhältnisses',
            description: 'Dokument, das Ihr Verwandtschaftsverhältnis belegt.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'requestType',
            conditionalValue: ['other']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'business-registration': {
    id: 'business-registration',
    title: 'Gewerbeanmeldung',
    description: 'Registrieren Sie ein neues Gewerbe',
    icon: '🏢',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Geschäftsdetails',
        description: 'Bitte geben Sie die Details zu Ihrem Gewerbe an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'businessType',
            label: 'Art des Gewerbes',
            type: 'select',
            options: [
              { value: 'sole', label: 'Einzelunternehmen' },
              { value: 'partnership', label: 'Personengesellschaft (GbR, OHG, KG)' },
              { value: 'corporation', label: 'Kapitalgesellschaft (GmbH, UG, AG)' },
              { value: 'other', label: 'Sonstiges' }
            ],
            required: true
          },
          {
            name: 'businessName',
            label: 'Name des Unternehmens',
            type: 'text',
            required: true
          },
          {
            name: 'businessAddress',
            label: 'Geschäftsadresse',
            type: 'text',
            required: true
          },
          {
            name: 'businessActivity',
            label: 'Beschreibung der Geschäftstätigkeit',
            type: 'text',
            required: true
          },
          {
            name: 'startDate',
            label: 'Startdatum der Geschäftstätigkeit',
            type: 'text',
            required: true
          },
          {
            name: 'employees',
            label: 'Werden Sie Mitarbeiter beschäftigen?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true
          },
          {
            name: 'employeeCount',
            label: 'Anzahl der geplanten Mitarbeiter',
            type: 'number',
            required: false,
            conditionalField: 'employees',
            conditionalValue: ['yes']
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'qualificationProof',
            label: 'Qualifikationsnachweise',
            description: 'Bei erlaubnispflichtigen Gewerben (z.B. Handwerk): Entsprechende Nachweise.',
            formats: ['jpg', 'png', 'pdf'],
            required: false
          },
          {
            name: 'companyRegistration',
            label: 'Handelsregisterauszug',
            description: 'Bei Gesellschaften: Aktueller Handelsregisterauszug.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'businessType',
            conditionalValue: ['partnership', 'corporation']
          },
          {
            name: 'partnershipAgreement',
            label: 'Gesellschaftervertrag',
            description: 'Bei Gesellschaften: Gesellschaftervertrag oder Satzung.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'businessType',
            conditionalValue: ['partnership', 'corporation']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'parental-allowance': {
    id: 'parental-allowance',
    title: 'Elterngeld',
    description: 'Beantragen Sie finanzielle Unterstützung für Eltern',
    icon: '👪',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Kindes- und Elternzeitdetails',
        description: 'Bitte geben Sie Details zum Kind und Ihrer geplanten Elternzeit an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'childName',
            label: 'Name des Kindes',
            type: 'text',
            required: true
          },
          {
            name: 'childBirthDate',
            label: 'Geburtsdatum des Kindes',
            type: 'text',
            required: true
          },
          {
            name: 'parentalLeaveStart',
            label: 'Beginn der Elternzeit',
            type: 'text',
            required: true
          },
          {
            name: 'parentalLeaveEnd',
            label: 'Ende der Elternzeit',
            type: 'text',
            required: true
          },
          {
            name: 'parentalAllowanceType',
            label: 'Art des Elterngeldes',
            type: 'select',
            options: [
              { value: 'basic', label: 'Basiselterngeld' },
              { value: 'plus', label: 'ElterngeldPlus' },
              { value: 'mixed', label: 'Kombination aus beiden' }
            ],
            required: true
          },
          {
            name: 'employmentBeforeBirth',
            label: 'Beschäftigungsstatus vor der Geburt',
            type: 'select',
            options: [
              { value: 'employed', label: 'Abhängig beschäftigt' },
              { value: 'selfemployed', label: 'Selbstständig' },
              { value: 'student', label: 'Student/in oder in Ausbildung' },
              { value: 'unemployed', label: 'Arbeitslos' },
              { value: 'other', label: 'Sonstiges' }
            ],
            required: true
          },
          {
            name: 'partnerApplication',
            label: 'Stellt auch Ihr/e Partner/in einen Antrag auf Elterngeld?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'birthCertificate',
            label: 'Geburtsurkunde des Kindes',
            description: 'Scan der Geburtsurkunde des Kindes.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'incomeProof',
            label: 'Einkommensnachweise',
            description: 'Einkommensnachweise der letzten 12 Monate vor der Geburt.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'employerConfirmation',
            label: 'Arbeitgeberbescheinigung',
            description: 'Bestätigung des Arbeitgebers über die Elternzeit.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'employmentBeforeBirth',
            conditionalValue: ['employed']
          },
          {
            name: 'taxAssessment',
            label: 'Steuerbescheid',
            description: 'Bei Selbstständigen: Letzter Steuerbescheid.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'employmentBeforeBirth',
            conditionalValue: ['selfemployed']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'building-permit': {
    id: 'building-permit',
    title: 'Baugenehmigung',
    description: 'Beantragen Sie eine Genehmigung für Bauvorhaben',
    icon: '🏗️',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Projektdetails',
        description: 'Bitte geben Sie die Details zu Ihrem Bauvorhaben an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'projectType',
            label: 'Art des Bauvorhabens',
            type: 'select',
            options: [
              { value: 'newBuilding', label: 'Neubau' },
              { value: 'renovation', label: 'Umbau/Renovierung' },
              { value: 'extension', label: 'Anbau/Erweiterung' },
              { value: 'demolition', label: 'Abriss' },
              { value: 'other', label: 'Sonstiges' }
            ],
            required: true
          },
          {
            name: 'propertyAddress',
            label: 'Adresse des Grundstücks',
            type: 'text',
            required: true
          },
          {
            name: 'plotNumber',
            label: 'Flurstücknummer',
            type: 'text',
            required: true
          },
          {
            name: 'buildingDescription',
            label: 'Beschreibung des Bauvorhabens',
            type: 'text',
            required: true
          },
          {
            name: 'estimatedCosts',
            label: 'Geschätzte Baukosten (in Euro)',
            type: 'number',
            required: true
          },
          {
            name: 'startDate',
            label: 'Geplantes Startdatum',
            type: 'text',
            required: true
          },
          {
            name: 'architect',
            label: 'Name des Architekten/Planers',
            type: 'text',
            required: false
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'propertyProof',
            label: 'Eigentumsnachweis',
            description: 'Grundbuchauszug oder Kaufvertrag.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'sitePlan',
            label: 'Lageplan',
            description: 'Amtlicher Lageplan im Maßstab 1:1000.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'buildingPlans',
            label: 'Baupläne',
            description: 'Grundrisse, Schnitte und Ansichten im Maßstab 1:100.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'staticCalculations',
            label: 'Statische Berechnungen',
            description: 'Von einem Statiker geprüfte Berechnungen.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'energyCertificate',
            label: 'Energieausweis',
            description: 'Nachweis über die Energieeffizienz des Gebäudes.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'dog-tax': {
    id: 'dog-tax',
    title: 'Hundesteuer',
    description: 'Melden Sie Ihren Hund an oder ab',
    icon: '🐕',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Hundedetails',
        description: 'Bitte geben Sie die Details zu Ihrem Hund an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'registrationType',
            label: 'Art der Meldung',
            type: 'select',
            options: [
              { value: 'register', label: 'Anmeldung' },
              { value: 'deregister', label: 'Abmeldung' },
              { value: 'change', label: 'Änderung der Daten' }
            ],
            required: true
          },
          {
            name: 'dogBreed',
            label: 'Hunderasse',
            type: 'text',
            required: true,
            conditionalField: 'registrationType',
            conditionalValue: ['register', 'change']
          },
          {
            name: 'dogName',
            label: 'Name des Hundes',
            type: 'text',
            required: false
          },
          {
            name: 'chipNumber',
            label: 'Mikrochip-Nummer',
            type: 'text',
            required: true,
            conditionalField: 'registrationType',
            conditionalValue: ['register', 'change']
          },
          {
            name: 'acquireDate',
            label: 'Datum der Anschaffung',
            type: 'text',
            required: true,
            conditionalField: 'registrationType',
            conditionalValue: ['register']
          },
          {
            name: 'deregisterReason',
            label: 'Grund der Abmeldung',
            type: 'select',
            options: [
              { value: 'moved', label: 'Umzug' },
              { value: 'sold', label: 'Verkauf/Abgabe' },
              { value: 'deceased', label: 'Tod des Hundes' }
            ],
            required: false,
            conditionalField: 'registrationType',
            conditionalValue: ['deregister']
          },
          {
            name: 'deregisterDate',
            label: 'Datum der Abmeldung',
            type: 'text',
            required: false,
            conditionalField: 'registrationType',
            conditionalValue: ['deregister']
          },
          {
            name: 'dangerousDog',
            label: 'Handelt es sich um einen Hund bestimmter Rassen oder einen gefährlichen Hund?',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true,
            conditionalField: 'registrationType',
            conditionalValue: ['register', 'change']
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'dogRegistration',
            label: 'Nachweis der Mikrochip-Registrierung',
            description: 'Dokument mit der Mikrochip-Nummer des Hundes.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'registrationType',
            conditionalValue: ['register', 'change']
          },
          {
            name: 'insuranceProof',
            label: 'Hundehaftpflichtversicherung',
            description: 'Nachweis über eine gültige Hundehaftpflichtversicherung.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'dangerousDog',
            conditionalValue: ['yes']
          },
          {
            name: 'deregisterProof',
            label: 'Nachweis über die Abmeldung',
            description: 'Bei Verkauf: Kaufvertrag, bei Tod: Bescheinigung des Tierarztes, bei Umzug: Meldebescheinigung.',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'registrationType',
            conditionalValue: ['deregister']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  },
  'waste-collection': {
    id: 'waste-collection',
    title: 'Müllabfuhr',
    description: 'Beantragen oder ändern Sie Ihre Mülltonnen',
    icon: '🗑️',
    formSteps: [
      {
        title: 'Persönliche Daten',
        description: 'Bitte geben Sie Ihre persönlichen Daten ein.',
        fields: 'personalData'
      },
      {
        title: 'Mülltonnendetails',
        description: 'Bitte geben Sie die Details zu Ihren Mülltonnen an.',
        fields: 'serviceSpecific',
        customFields: [
          {
            name: 'serviceType',
            label: 'Art der Beantragung',
            type: 'select',
            options: [
              { value: 'new', label: 'Neubestellung' },
              { value: 'change', label: 'Änderung bestehender Tonnen' },
              { value: 'cancel', label: 'Abmeldung' }
            ],
            required: true
          },
          {
            name: 'propertyType',
            label: 'Art der Immobilie',
            type: 'select',
            options: [
              { value: 'singleFamily', label: 'Einfamilienhaus' },
              { value: 'apartment', label: 'Wohnung in Mehrfamilienhaus' },
              { value: 'commercial', label: 'Gewerbeobjekt' }
            ],
            required: true
          },
          {
            name: 'residentCount',
            label: 'Anzahl der im Haushalt lebenden Personen',
            type: 'number',
            required: true,
            conditionalField: 'serviceType',
            conditionalValue: ['new', 'change']
          },
          {
            name: 'wasteGeneralNeeded',
            label: 'Restmülltonne',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true,
            conditionalField: 'serviceType',
            conditionalValue: ['new', 'change']
          },
          {
            name: 'wasteGeneralSize',
            label: 'Größe der Restmülltonne',
            type: 'select',
            options: [
              { value: '60', label: '60 Liter' },
              { value: '120', label: '120 Liter' },
              { value: '240', label: '240 Liter' },
              { value: '1100', label: '1100 Liter (nur für Mehrfamilienhäuser)' }
            ],
            required: false,
            conditionalField: 'wasteGeneralNeeded',
            conditionalValue: ['yes']
          },
          {
            name: 'wasteBioNeeded',
            label: 'Biotonne',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true,
            conditionalField: 'serviceType',
            conditionalValue: ['new', 'change']
          },
          {
            name: 'wasteBioSize',
            label: 'Größe der Biotonne',
            type: 'select',
            options: [
              { value: '60', label: '60 Liter' },
              { value: '120', label: '120 Liter' },
              { value: '240', label: '240 Liter' }
            ],
            required: false,
            conditionalField: 'wasteBioNeeded',
            conditionalValue: ['yes']
          },
          {
            name: 'wasteRecyclingNeeded',
            label: 'Wertstofftonne',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true,
            conditionalField: 'serviceType',
            conditionalValue: ['new', 'change']
          },
          {
            name: 'wastePaperNeeded',
            label: 'Papiertonne',
            type: 'radio',
            options: [
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nein' }
            ],
            required: true,
            conditionalField: 'serviceType',
            conditionalValue: ['new', 'change']
          },
          {
            name: 'serviceStartDate',
            label: 'Gewünschtes Startdatum',
            type: 'text',
            required: true,
            conditionalField: 'serviceType',
            conditionalValue: ['new', 'change']
          },
          {
            name: 'serviceEndDate',
            label: 'Datum der Abmeldung',
            type: 'text',
            required: false,
            conditionalField: 'serviceType',
            conditionalValue: ['cancel']
          }
        ]
      },
      {
        title: 'Dokumente hochladen',
        description: 'Bitte laden Sie die erforderlichen Dokumente hoch.',
        fields: 'documents',
        requiredDocuments: [
          {
            name: 'idCard',
            label: 'Personalausweis',
            description: 'Scan Ihres Personalausweises (Vorder- und Rückseite).',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'propertyProof',
            label: 'Eigentumsnachweis oder Mietvertrag',
            description: 'Nachweis über Wohnsitz an der angegebenen Adresse.',
            formats: ['jpg', 'png', 'pdf'],
            required: true
          },
          {
            name: 'landlordConsent',
            label: 'Einverständniserklärung des Vermieters',
            description: 'Bei Mietobjekten: Einverständnis des Vermieters zur Änderung der Mülltonnen (falls erforderlich).',
            formats: ['jpg', 'png', 'pdf'],
            required: false,
            conditionalField: 'propertyType',
            conditionalValue: ['apartment']
          }
        ]
      },
      {
        title: 'Bestätigung',
        description: 'Bitte überprüfen Sie Ihre Angaben und bestätigen Sie diese.',
        fields: 'confirmation'
      }
    ]
  }
  // Additional services would be added here...
})

// Helper computed properties
const service = computed(() => {
  if (serviceDetails.value[serviceId]) {
    return serviceDetails.value[serviceId]
  }
  return null
})

const steps = computed(() => {
  if (service.value) {
    return service.value.formSteps
  }
  return []
})

const currentStepData = computed(() => {
  if (steps.value.length > currentStep.value) {
    return steps.value[currentStep.value]
  }
  return null
})

const currentFieldsType = computed(() => {
  if (currentStepData.value) {
    return currentStepData.value.fields
  }
  return null
})

const currentFields = computed(() => {
  if (currentFieldsType.value) {
    return formData.value[currentFieldsType.value]
  }
  return {}
})

const currentTouchedFields = computed(() => {
  if (currentFieldsType.value) {
    return touchedFields.value[currentFieldsType.value]
  }
  return {}
})

const canGoNext = computed(() => {
  if (!currentStepData.value) return false
  
  if (currentFieldsType.value === 'personalData') {
    return validatePersonalData()
  } else if (currentFieldsType.value === 'serviceSpecific') {
    return validateServiceSpecificData()
  } else if (currentFieldsType.value === 'documents') {
    return validateDocuments()
  } else if (currentFieldsType.value === 'confirmation') {
    return validateConfirmation()
  }
  
  return true
})

const canGoBack = computed(() => {
  return currentStep.value > 0
})

const progressPercentage = computed(() => {
  if (steps.value.length === 0) return 0
  return (currentStep.value / (steps.value.length - 1)) * 100
})

// Validation functions
const validatePersonalData = () => {
  const personalData = formData.value.personalData
  
  // Set all required fields for personal data
  const requiredFields = [
    'salutation', 'firstName', 'lastName', 'dateOfBirth',
    'email', 'phone', 'street', 'houseNumber', 'postalCode', 'city'
  ]
  
  let valid = true
  requiredFields.forEach(field => {
    if (!personalData[field] || personalData[field].trim() === '') {
      valid = false
    }
  })
  
  // Email validation
  if (personalData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
    valid = false
  }
  
  // Phone validation
  if (personalData.phone && !/^[\d\s\+\-()]{8,}$/.test(personalData.phone)) {
    valid = false
  }
  
  return valid
}

const validateServiceSpecificData = () => {
  if (!currentStepData.value || !currentStepData.value.customFields) return true
  
  const serviceSpecificData = formData.value.serviceSpecific
  let valid = true
  
  // Check custom fields
  currentStepData.value.customFields.forEach(field => {
    // If field is required
    if (field.required) {
      if (!serviceSpecificData[field.name] || serviceSpecificData[field.name] === '') {
        valid = false
      }
    }
    
    // For conditional fields
    if (field.conditionalField && field.conditionalValue) {
      const conditionValue = serviceSpecificData[field.conditionalField]
      const isConditionMet = Array.isArray(field.conditionalValue) 
        ? field.conditionalValue.includes(conditionValue)
        : field.conditionalValue === conditionValue
      
      if (isConditionMet && (!serviceSpecificData[field.name] || serviceSpecificData[field.name] === '')) {
        valid = false
      }
    }
  })
  
  return valid
}

const validateDocuments = () => {
  if (!currentStepData.value || !currentStepData.value.requiredDocuments) return true
  
  const documentFiles = formData.value.documents.files
  let valid = true
  
  // In a real application, we would check if all required documents are uploaded
  // For demo purposes, we'll just require at least one document
  if (documentFiles.length === 0) {
    valid = false
  }
  
  return valid
}

const validateConfirmation = () => {
  const confirmation = formData.value.confirmation
  return confirmation.agreeToTerms && confirmation.agreeToDataProcessing
}

// Navigation functions
const goToStep = (step) => {
  if (step >= 0 && step < steps.value.length && step <= maxStepVisited.value) {
    currentStep.value = step
  }
}

const nextStep = () => {
  if (currentStep.value < steps.value.length - 1 && canGoNext.value) {
    currentStep.value++
    maxStepVisited.value = Math.max(maxStepVisited.value, currentStep.value)
  } else if (currentStep.value === steps.value.length - 1 && canGoNext.value) {
    completeForm()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const completeForm = () => {
  // In a real application, this would send the form data to an API
  formComplete.value = true
  
  // Simulate processing time
  setTimeout(() => {
    router.push('/dashboard')
  }, 3000)
}

// Field touch handlers
const touchField = (section, field) => {
  if (!touchedFields.value[section]) {
    touchedFields.value[section] = {}
  }
  touchedFields.value[section][field] = true
}

// Document handling
const addDocument = (document) => {
  // This would be an API call in a real application
  formData.value.documents.files.push(document)
}

const removeDocument = (index) => {
  formData.value.documents.files.splice(index, 1)
}

const simulateFileUpload = (documentType) => {
  // This simulates a file upload for demonstration purposes
  const document = {
    id: Date.now().toString(),
    type: documentType,
    name: `${documentType}_${Date.now()}.pdf`,
    size: Math.floor(Math.random() * 5000000),
    uploadDate: new Date().toISOString()
  }
  
  addDocument(document)
}

// Check if a document type has been uploaded
const isDocumentUploaded = (documentType) => {
  return formData.value.documents.files.some(file => file.type === documentType)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
}

onMounted(() => {
  // Initialize the serviceSpecific object based on service type
  if (service.value && service.value.formSteps) {
    const serviceSpecificStep = service.value.formSteps.find(step => step.fields === 'serviceSpecific')
    if (serviceSpecificStep && serviceSpecificStep.customFields) {
      serviceSpecificStep.customFields.forEach(field => {
        formData.value.serviceSpecific[field.name] = field.type === 'number' ? 0 : ''
      })
    }
  }
})
</script>

<template>
  <div class="application-form-view">
    <!-- Form Completion Screen -->
    <div v-if="formComplete" class="form-complete-container">
      <div class="form-complete-content">
        <div class="success-icon">✓</div>
        <h2>Ihr Antrag wurde erfolgreich eingereicht!</h2>
        <p>Sie werden in Kürze zu Ihrem persönlichen Bereich weitergeleitet, wo Sie den Status Ihres Antrags verfolgen können.</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <!-- Error Screen if Service not found -->
    <div v-else-if="!service" class="error-container">
      <h2>Dienst nicht gefunden</h2>
      <p>Der angeforderte Dienst konnte nicht gefunden werden.</p>
      <button 
        v-voix="'back-to-services'" 
        hint="Zurück zur Übersicht aller Dienstleistungen"
        class="back-button" 
        @click="router.push('/services')">
        Zurück zur Übersicht
      </button>
    </div>
    
    <!-- Application Form -->
    <div v-else class="form-container">
      <div class="form-header">
        <div class="back-link">
          <button 
            v-voix="'back-button'" 
            hint="Zurück zur vorherigen Seite"
            class="back-link-button" 
            @click="router.back()">
            &larr; Zurück zu {{ service.title }}
          </button>
        </div>
        
        <h1>Antrag: {{ service.title }}</h1>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        
        <div class="step-indicators">
          <button 
            v-for="(step, index) in steps" 
            :key="index"
            v-voix="'step-' + index + '-indicator'" 
            :hint="`Navigiert zu Schritt ${index + 1}: ${step.title}`"
            class="step-indicator" 
            :class="{ 
              'active': currentStep === index,
              'completed': index < currentStep,
              'enabled': index <= maxStepVisited
            }"
            :disabled="index > maxStepVisited"
            @click="goToStep(index)">
            {{ index + 1 }}
          </button>
        </div>
        
        <div class="step-titles">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-title" 
            :class="{ 'active': currentStep === index }">
            {{ step.title }}
          </div>
        </div>
      </div>
      
      <!-- Step Content -->
      <div class="step-content">
        <div v-if="currentStepData" class="step-container">
          <h2>{{ currentStepData.title }}</h2>
          <p class="step-description">{{ currentStepData.description }}</p>
          
          <!-- Personal Data Fields -->
          <div v-if="currentFieldsType === 'personalData'" class="form-fields">
            <div class="form-section">
              <h3>Persönliche Informationen</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="salutation">Anrede <span class="required">*</span></label>
                  <select 
                    v-voix="'salutation-field'" 
                    hint="Wählen Sie Ihre Anrede aus"
                    id="salutation" 
                    v-model="formData.personalData.salutation"
                    @blur="touchField('personalData', 'salutation')"
                    :class="{ 'invalid': currentTouchedFields['salutation'] && !formData.personalData.salutation }">
                    <option value="">Bitte wählen</option>
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                    <option value="Divers">Divers</option>
                  </select>
                  <div v-if="currentTouchedFields['salutation'] && !formData.personalData.salutation" class="error-message">
                    Bitte wählen Sie Ihre Anrede aus.
                  </div>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Vorname <span class="required">*</span></label>
                  <input 
                    v-voix="'firstName-field'" 
                    hint="Geben Sie Ihren Vornamen ein"
                    type="text" 
                    id="firstName" 
                    v-model="formData.personalData.firstName"
                    @blur="touchField('personalData', 'firstName')"
                    :class="{ 'invalid': currentTouchedFields['firstName'] && !formData.personalData.firstName }">
                  <div v-if="currentTouchedFields['firstName'] && !formData.personalData.firstName" class="error-message">
                    Bitte geben Sie Ihren Vornamen ein.
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="lastName">Nachname <span class="required">*</span></label>
                  <input 
                    v-voix="'lastName-field'" 
                    hint="Geben Sie Ihren Nachnamen ein"
                    type="text" 
                    id="lastName" 
                    v-model="formData.personalData.lastName"
                    @blur="touchField('personalData', 'lastName')"
                    :class="{ 'invalid': currentTouchedFields['lastName'] && !formData.personalData.lastName }">
                  <div v-if="currentTouchedFields['lastName'] && !formData.personalData.lastName" class="error-message">
                    Bitte geben Sie Ihren Nachnamen ein.
                  </div>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="dateOfBirth">Geburtsdatum <span class="required">*</span></label>
                  <input 
                    v-voix="'dateOfBirth-field'" 
                    hint="Geben Sie Ihr Geburtsdatum ein"
                    type="date" 
                    id="dateOfBirth" 
                    v-model="formData.personalData.dateOfBirth"
                    @blur="touchField('personalData', 'dateOfBirth')"
                    :class="{ 'invalid': currentTouchedFields['dateOfBirth'] && !formData.personalData.dateOfBirth }">
                  <div v-if="currentTouchedFields['dateOfBirth'] && !formData.personalData.dateOfBirth" class="error-message">
                    Bitte geben Sie Ihr Geburtsdatum ein.
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="placeOfBirth">Geburtsort</label>
                  <input 
                    v-voix="'placeOfBirth-field'" 
                    hint="Geben Sie Ihren Geburtsort ein"
                    type="text" 
                    id="placeOfBirth" 
                    v-model="formData.personalData.placeOfBirth">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="nationality">Staatsangehörigkeit</label>
                  <input 
                    v-voix="'nationality-field'" 
                    hint="Geben Sie Ihre Staatsangehörigkeit ein"
                    type="text" 
                    id="nationality" 
                    v-model="formData.personalData.nationality">
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3>Kontaktdaten</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="email">E-Mail <span class="required">*</span></label>
                  <input 
                    v-voix="'email-field'" 
                    hint="Geben Sie Ihre E-Mail-Adresse ein"
                    type="email" 
                    id="email" 
                    v-model="formData.personalData.email"
                    @blur="touchField('personalData', 'email')"
                    :class="{ 'invalid': currentTouchedFields['email'] && (!formData.personalData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalData.email)) }">
                  <div v-if="currentTouchedFields['email'] && !formData.personalData.email" class="error-message">
                    Bitte geben Sie Ihre E-Mail-Adresse ein.
                  </div>
                  <div v-else-if="currentTouchedFields['email'] && formData.personalData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalData.email)" class="error-message">
                    Bitte geben Sie eine gültige E-Mail-Adresse ein.
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="phone">Telefon <span class="required">*</span></label>
                  <input 
                    v-voix="'phone-field'" 
                    hint="Geben Sie Ihre Telefonnummer ein"
                    type="tel" 
                    id="phone" 
                    v-model="formData.personalData.phone"
                    @blur="touchField('personalData', 'phone')"
                    :class="{ 'invalid': currentTouchedFields['phone'] && (!formData.personalData.phone || !/^[\d\s\+\-()]{8,}$/.test(formData.personalData.phone)) }">
                  <div v-if="currentTouchedFields['phone'] && !formData.personalData.phone" class="error-message">
                    Bitte geben Sie Ihre Telefonnummer ein.
                  </div>
                  <div v-else-if="currentTouchedFields['phone'] && formData.personalData.phone && !/^[\d\s\+\-()]{8,}$/.test(formData.personalData.phone)" class="error-message">
                    Bitte geben Sie eine gültige Telefonnummer ein.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3>Adresse</h3>
              
              <div class="form-row">
                <div class="form-group wide">
                  <label for="street">Straße <span class="required">*</span></label>
                  <input 
                    v-voix="'street-field'" 
                    hint="Geben Sie Ihren Straßennamen ein"
                    type="text" 
                    id="street" 
                    v-model="formData.personalData.street"
                    @blur="touchField('personalData', 'street')"
                    :class="{ 'invalid': currentTouchedFields['street'] && !formData.personalData.street }">
                  <div v-if="currentTouchedFields['street'] && !formData.personalData.street" class="error-message">
                    Bitte geben Sie Ihre Straße ein.
                  </div>
                </div>
                
                <div class="form-group narrow">
                  <label for="houseNumber">Hausnummer <span class="required">*</span></label>
                  <input 
                    v-voix="'houseNumber-field'" 
                    hint="Geben Sie Ihre Hausnummer ein"
                    type="text" 
                    id="houseNumber" 
                    v-model="formData.personalData.houseNumber"
                    @blur="touchField('personalData', 'houseNumber')"
                    :class="{ 'invalid': currentTouchedFields['houseNumber'] && !formData.personalData.houseNumber }">
                  <div v-if="currentTouchedFields['houseNumber'] && !formData.personalData.houseNumber" class="error-message">
                    Bitte geben Sie Ihre Hausnummer ein.
                  </div>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group narrow">
                  <label for="postalCode">PLZ <span class="required">*</span></label>
                  <input 
                    v-voix="'postalCode-field'" 
                    hint="Geben Sie Ihre Postleitzahl ein"
                    type="text" 
                    id="postalCode" 
                    v-model="formData.personalData.postalCode"
                    @blur="touchField('personalData', 'postalCode')"
                    :class="{ 'invalid': currentTouchedFields['postalCode'] && !formData.personalData.postalCode }">
                  <div v-if="currentTouchedFields['postalCode'] && !formData.personalData.postalCode" class="error-message">
                    Bitte geben Sie Ihre Postleitzahl ein.
                  </div>
                </div>
                
                <div class="form-group wide">
                  <label for="city">Ort <span class="required">*</span></label>
                  <input 
                    v-voix="'city-field'" 
                    hint="Geben Sie Ihren Wohnort ein"
                    type="text" 
                    id="city" 
                    v-model="formData.personalData.city"
                    @blur="touchField('personalData', 'city')"
                    :class="{ 'invalid': currentTouchedFields['city'] && !formData.personalData.city }">
                  <div v-if="currentTouchedFields['city'] && !formData.personalData.city" class="error-message">
                    Bitte geben Sie Ihren Ort ein.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Service Specific Fields -->
          <div v-else-if="currentFieldsType === 'serviceSpecific' && currentStepData.customFields" class="form-fields">
            <div class="form-section">
              <div v-for="field in currentStepData.customFields" :key="field.name" class="form-group">
                <!-- Show field only if it's not conditional or if the condition is met -->
                <div v-if="!field.conditionalField || 
                  (Array.isArray(field.conditionalValue) ? 
                    field.conditionalValue.includes(formData.serviceSpecific[field.conditionalField]) : 
                    formData.serviceSpecific[field.conditionalField] === field.conditionalValue)">
                  
                  <!-- Radio Buttons -->
                  <div v-if="field.type === 'radio'" class="radio-group">
                    <label>{{ field.label }} <span v-if="field.required" class="required">*</span></label>
                    <div class="radio-options">
                      <div v-for="option in field.options" :key="option.value" class="radio-option">
                        <input 
                          v-voix="field.name + '-' + option.value" 
                          :hint="'Option: ' + option.label"
                          type="radio" 
                          :id="field.name + '-' + option.value" 
                          :name="field.name" 
                          :value="option.value" 
                          v-model="formData.serviceSpecific[field.name]"
                          @blur="touchField('serviceSpecific', field.name)">
                        <label :for="field.name + '-' + option.value">{{ option.label }}</label>
                      </div>
                    </div>
                    <div v-if="field.required && currentTouchedFields[field.name] && !formData.serviceSpecific[field.name]" class="error-message">
                      Bitte wählen Sie eine Option aus.
                    </div>
                  </div>
                  
                  <!-- Select Dropdown -->
                  <div v-else-if="field.type === 'select'">
                    <label :for="field.name">{{ field.label }} <span v-if="field.required" class="required">*</span></label>
                    <select 
                      v-voix="field.name + '-field'" 
                      :hint="'Wählen Sie ' + field.label"
                      :id="field.name" 
                      v-model="formData.serviceSpecific[field.name]"
                      @blur="touchField('serviceSpecific', field.name)"
                      :class="{ 'invalid': field.required && currentTouchedFields[field.name] && !formData.serviceSpecific[field.name] }">
                      <option value="">Bitte wählen</option>
                      <option v-for="option in field.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <div v-if="field.required && currentTouchedFields[field.name] && !formData.serviceSpecific[field.name]" class="error-message">
                      Bitte treffen Sie eine Auswahl.
                    </div>
                  </div>
                  
                  <!-- Number Input -->
                  <div v-else-if="field.type === 'number'">
                    <label :for="field.name">{{ field.label }} <span v-if="field.required" class="required">*</span></label>
                    <input 
                      v-voix="field.name + '-field'" 
                      :hint="'Geben Sie ' + field.label + ' ein'"
                      type="number" 
                      :id="field.name" 
                      v-model="formData.serviceSpecific[field.name]"
                      @blur="touchField('serviceSpecific', field.name)"
                      :class="{ 'invalid': field.required && currentTouchedFields[field.name] && (formData.serviceSpecific[field.name] === '' || formData.serviceSpecific[field.name] === null) }">
                    <div v-if="field.required && currentTouchedFields[field.name] && (formData.serviceSpecific[field.name] === '' || formData.serviceSpecific[field.name] === null)" class="error-message">
                      Bitte geben Sie einen Wert ein.
                    </div>
                  </div>
                  
                  <!-- Default Text Input (for other field types) -->
                  <div v-else>
                    <label :for="field.name">{{ field.label }} <span v-if="field.required" class="required">*</span></label>
                    <input 
                      v-voix="field.name + '-field'" 
                      :hint="'Geben Sie ' + field.label + ' ein'"
                      type="text" 
                      :id="field.name" 
                      v-model="formData.serviceSpecific[field.name]"
                      @blur="touchField('serviceSpecific', field.name)"
                      :class="{ 'invalid': field.required && currentTouchedFields[field.name] && !formData.serviceSpecific[field.name] }">
                    <div v-if="field.required && currentTouchedFields[field.name] && !formData.serviceSpecific[field.name]" class="error-message">
                      Dieses Feld ist erforderlich.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Document Upload Section -->
          <div v-else-if="currentFieldsType === 'documents' && currentStepData.requiredDocuments" class="form-fields">
            <div class="documents-container">
              <div v-for="doc in currentStepData.requiredDocuments" :key="doc.name" class="document-item">
                <!-- Show document only if it's not conditional or if the condition is met -->
                <div v-if="!doc.conditionalField || 
                  (Array.isArray(doc.conditionalValue) ? 
                    doc.conditionalValue.includes(formData.serviceSpecific[doc.conditionalField]) : 
                    formData.serviceSpecific[doc.conditionalField] === doc.conditionalValue)" 
                  class="document-card">
                  
                  <div class="document-info">
                    <h4>{{ doc.label }} <span v-if="doc.required" class="required">*</span></h4>
                    <p>{{ doc.description }}</p>
                    <div class="formats-info">
                      Akzeptierte Formate: <span v-for="(format, idx) in doc.formats" :key="format">{{ format }}{{ idx < doc.formats.length - 1 ? ', ' : '' }}</span>
                    </div>
                  </div>
                  
                  <div v-if="isDocumentUploaded(doc.name)" class="document-uploaded">
                    <div class="uploaded-file" v-for="(file, index) in formData.documents.files.filter(f => f.type === doc.name)" :key="file.id">
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button 
                        v-voix="'remove-document-' + file.id" 
                        hint="Entfernt dieses Dokument"
                        class="remove-file" 
                        @click="removeDocument(formData.documents.files.indexOf(file))">
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div v-else class="document-upload">
                    <button 
                      v-voix="'upload-' + doc.name" 
                      :hint="`Lädt ${doc.label} hoch`"
                      class="upload-button" 
                      @click="simulateFileUpload(doc.name)">
                      Dokument hochladen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Confirmation Section -->
          <div v-else-if="currentFieldsType === 'confirmation'" class="form-fields">
            <div class="form-section">
              <h3>Zusammenfassung Ihrer Daten</h3>
              
              <div class="summary-section">
                <h4>Persönliche Daten</h4>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Name:</span>
                    <span class="summary-value">{{ formData.personalData.salutation }} {{ formData.personalData.firstName }} {{ formData.personalData.lastName }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Geburtsdatum:</span>
                    <span class="summary-value">{{ formData.personalData.dateOfBirth }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Adresse:</span>
                    <span class="summary-value">{{ formData.personalData.street }} {{ formData.personalData.houseNumber }}, {{ formData.personalData.postalCode }} {{ formData.personalData.city }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Kontakt:</span>
                    <span class="summary-value">{{ formData.personalData.email }}, {{ formData.personalData.phone }}</span>
                  </div>
                </div>
              </div>
              
              <div class="summary-section">
                <h4>Spezifische Angaben</h4>
                <div class="summary-grid">
                  <div v-for="(value, key) in formData.serviceSpecific" :key="key" class="summary-item" v-if="value">
                    <span class="summary-label">{{ 
                      // Find the custom field label
                      steps.find(s => s.fields === 'serviceSpecific')?.customFields?.find(f => f.name === key)?.label || key 
                    }}:</span>
                    <span class="summary-value">{{ 
                      // Format the value if it's an option
                      steps.find(s => s.fields === 'serviceSpecific')?.customFields?.find(f => f.name === key)?.options?.find(o => o.value === value)?.label || value 
                    }}</span>
                  </div>
                </div>
              </div>
              
              <div class="summary-section">
                <h4>Hochgeladene Dokumente</h4>
                <div v-if="formData.documents.files.length === 0" class="no-documents">
                  <p>Keine Dokumente hochgeladen.</p>
                </div>
                <div v-else class="documents-summary">
                  <div v-for="file in formData.documents.files" :key="file.id" class="document-item-summary">
                    <span class="document-name">{{ file.name }}</span>
                    <span class="document-size">{{ formatFileSize(file.size) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="agreement-section">
                <h4>Einwilligungen</h4>
                
                <div class="form-group checkbox-group">
                  <div class="checkbox-container">
                    <input 
                      v-voix="'terms-checkbox'" 
                      hint="Zustimmung zu den Nutzungsbedingungen"
                      type="checkbox" 
                      id="agreeToTerms" 
                      v-model="formData.confirmation.agreeToTerms">
                    <label for="agreeToTerms">Ich stimme den <a href="#" v-voix="'terms-link'" hint="Öffnet die Nutzungsbedingungen">Nutzungsbedingungen</a> zu. <span class="required">*</span></label>
                  </div>
                  <div v-if="touchedFields.confirmation?.agreeToTerms && !formData.confirmation.agreeToTerms" class="error-message">
                    Sie müssen den Nutzungsbedingungen zustimmen, um fortzufahren.
                  </div>
                </div>
                
                <div class="form-group checkbox-group">
                  <div class="checkbox-container">
                    <input 
                      v-voix="'data-processing-checkbox'" 
                      hint="Zustimmung zur Datenverarbeitung"
                      type="checkbox" 
                      id="agreeToDataProcessing" 
                      v-model="formData.confirmation.agreeToDataProcessing">
                    <label for="agreeToDataProcessing">Ich stimme der <a href="#" v-voix="'privacy-link'" hint="Öffnet die Datenschutzerklärung">Verarbeitung meiner Daten</a> gemäß der Datenschutzerklärung zu. <span class="required">*</span></label>
                  </div>
                  <div v-if="touchedFields.confirmation?.agreeToDataProcessing && !formData.confirmation.agreeToDataProcessing" class="error-message">
                    Sie müssen der Datenverarbeitung zustimmen, um fortzufahren.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="form-navigation">
        <button 
          v-voix="'prev-step'" 
          hint="Geht zum vorherigen Schritt zurück"
          class="prev-button" 
          :disabled="!canGoBack"
          @click="prevStep">
          Zurück
        </button>
        
        <button 
          v-voix="'next-step'" 
          :hint="currentStep === steps.length - 1 ? 'Schließt den Antrag ab' : 'Geht zum nächsten Schritt'"
          class="next-button" 
          :disabled="!canGoNext"
          @click="nextStep">
          {{ currentStep === steps.length - 1 ? 'Absenden' : 'Weiter' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.application-form-view {
  animation: fadeIn 0.5s ease-out;
}

/* Form Complete Screen */
.form-complete-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.form-complete-content {
  text-align: center;
  padding: 3rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  max-width: 600px;
}

.success-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: var(--success-color);
  border-radius: 50%;
  color: white;
  font-size: 3rem;
  margin: 0 auto 2rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  margin: 0 6px;
  background-color: var(--primary-color);
  border-radius: 50%;
  animation: dotPulse 1.5s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Error Container */
.error-container {
  text-align: center;
  padding: 3rem;
}

.back-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;
}

/* Form Container */
.form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
}

.form-header {
  margin-bottom: 2rem;
}

.back-link {
  margin-bottom: 1rem;
}

.back-link-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

.form-header h1 {
  font-size: 1.75rem;
  color: var(--primary-color);
  margin: 0;
}

/* Progress Bar */
.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.step-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--border-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.step-indicator::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  width: 100%;
  height: 2px;
  background-color: var(--border-color);
  transform: translateY(-50%);
  z-index: -1;
}

.step-indicator:first-child::before {
  display: none;
}

.step-indicator.active {
  background-color: var(--primary-color);
  color: white;
}

.step-indicator.completed {
  background-color: var(--success-color);
  color: white;
}

.step-indicator.completed::before,
.step-indicator.active::before {
  background-color: var(--success-color);
}

.step-indicator:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-titles {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.step-title {
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
  font-weight: bold;
  transition: opacity 0.3s ease, color 0.3s ease;
  flex: 1;
}

.step-title.active {
  color: var(--primary-color);
  opacity: 1;
}

/* Step Content */
.step-content {
  margin-bottom: 2rem;
}

.step-container h2 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.step-description {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 2rem;
}

/* Form Fields */
.form-fields {
  animation: fadeIn 0.3s ease-out;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  min-width: 250px;
  margin-bottom: 1rem;
}

.form-group.wide {
  flex: 3;
}

.form-group.narrow {
  flex: 1;
  min-width: 120px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
}

.form-group input.invalid,
.form-group select.invalid {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.required {
  color: var(--error-color);
}

/* Radio and Checkbox Styles */
.radio-group,
.checkbox-group {
  margin-bottom: 1.5rem;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.radio-option,
.checkbox-container {
  display: flex;
  align-items: center;
}

.radio-option input[type="radio"],
.checkbox-container input[type="checkbox"] {
  width: auto;
  margin-right: 0.75rem;
}

/* Document Upload Section */
.documents-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.document-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  transition: box-shadow 0.3s ease;
}

.document-card:hover {
  box-shadow: var(--shadow);
}

.document-info h4 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.document-info p {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.formats-info {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.document-upload {
  margin-top: auto;
}

.upload-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.upload-button:hover {
  background-color: var(--secondary-color);
}

.document-uploaded {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.uploaded-file {
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.8rem;
  opacity: 0.7;
}

.remove-file {
  background-color: var(--error-color);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.8rem;
}

/* Summary Section */
.summary-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
}

.summary-section h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-weight: bold;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.documents-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-item-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--card-background);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.document-name {
  font-weight: bold;
}

.document-size {
  font-size: 0.8rem;
  opacity: 0.7;
}

.no-documents {
  text-align: center;
  padding: 1rem;
  color: var(--text-color);
  opacity: 0.7;
}

.agreement-section a {
  color: var(--primary-color);
  text-decoration: none;
}

.agreement-section a:hover {
  text-decoration: underline;
}

/* Navigation Buttons */
.form-navigation {
  display: flex;
  justify-content: space-between;
}

.prev-button,
.next-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.prev-button {
  background-color: var(--border-color);
  color: var(--text-color);
  border: none;
}

.prev-button:hover:not(:disabled) {
  background-color: var(--text-color);
  color: white;
}

.next-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.next-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.prev-button:disabled,
.next-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
  }
  
  .step-titles {
    display: none;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-group,
  .form-group.wide,
  .form-group.narrow {
    min-width: auto;
    width: 100%;
  }
  
  .document-card {
    padding: 1rem;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .prev-button,
  .next-button {
    padding: 0.75rem 1rem;
  }
}
</style>