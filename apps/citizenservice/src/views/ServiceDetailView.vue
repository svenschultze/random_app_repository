<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const serviceId = route.params.id
const loading = ref(true)
const accordionOpen = ref(null)

// This would come from an API in a real application
const serviceDetails = ref({
  'id-card': {
    id: 'id-card',
    title: 'Personalausweis',
    description: 'Beantragen oder Verlängern Sie Ihren Personalausweis digital und bequem von zu Hause aus.',
    icon: '📇',
    longDescription: 'Der Personalausweis ist ein amtlicher Lichtbildausweis für deutsche Staatsangehörige. Er dient innerhalb Deutschlands und in vielen anderen europäischen Ländern als Identitätsnachweis.',
    requirements: [
      'Deutsche Staatsbürgerschaft',
      'Aktuelle biometrische Passfotos',
      'Bei Erstbeantragung: Geburtsurkunde',
      'Bei Namensänderung: Entsprechende Nachweise',
      'Bei Verlust: Verlustanzeige bei der Polizei'
    ],
    process: [
      'Antrag online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Termin zur Abholung vereinbaren (persönliche Anwesenheit erforderlich)',
      'Bezahlung der Gebühren'
    ],
    fees: {
      standard: '37,00 €',
      express: '69,00 €',
      underAge24: '22,80 €'
    },
    processingTime: '2-3 Wochen',
    faq: [
      {
        question: 'Kann ich den Personalausweis für meine Kinder beantragen?',
        answer: 'Ja, für minderjährige Kinder können die Erziehungsberechtigten den Ausweis beantragen. Bei der Abholung muss das Kind jedoch anwesend sein.'
      },
      {
        question: 'Muss ich meinen alten Personalausweis abgeben?',
        answer: 'Ja, bei der Abholung des neuen Ausweises muss der alte abgegeben werden.'
      },
      {
        question: 'Kann ich den Personalausweis auch im Ausland beantragen?',
        answer: 'Ja, im Ausland können Sie sich an die deutsche Botschaft oder das Konsulat wenden.'
      }
    ]
  },
  'passport': {
    id: 'passport',
    title: 'Reisepass',
    description: 'Beantragen oder Verlängern Sie Ihren Reisepass für weltweites Reisen.',
    icon: '🛂',
    longDescription: 'Der Reisepass ist ein international anerkanntes Reisedokument für deutsche Staatsangehörige. Er berechtigt zur Ein- und Ausreise in viele Länder weltweit.',
    requirements: [
      'Deutsche Staatsbürgerschaft',
      'Aktuelle biometrische Passfotos',
      'Bei Erstbeantragung: Geburtsurkunde',
      'Bei Namensänderung: Entsprechende Nachweise',
      'Bei Verlust: Verlustanzeige bei der Polizei'
    ],
    process: [
      'Antrag online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Termin zur Abholung vereinbaren (persönliche Anwesenheit erforderlich)',
      'Bezahlung der Gebühren'
    ],
    fees: {
      standard: '60,00 €',
      express: '91,00 €',
      underAge24: '37,50 €'
    },
    processingTime: '3-4 Wochen',
    faq: [
      {
        question: 'Wie lange ist der Reisepass gültig?',
        answer: 'Der reguläre Reisepass ist 10 Jahre gültig, für Personen unter 24 Jahren 6 Jahre.'
      },
      {
        question: 'Benötige ich zusätzlich zum Reisepass ein Visum?',
        answer: 'Das hängt vom Reiseziel ab. Für viele Länder reicht der deutsche Reisepass, für andere wird ein zusätzliches Visum benötigt.'
      }
    ]
  },
  'address-change': {
    id: 'address-change',
    title: 'Ummeldung',
    description: 'Melden Sie Ihren neuen Wohnsitz an oder um.',
    icon: '🏠',
    longDescription: 'Bei einem Umzug besteht in Deutschland eine gesetzliche Meldepflicht. Nach einem Umzug müssen Sie Ihren neuen Wohnsitz innerhalb von zwei Wochen beim Einwohnermeldeamt anmelden.',
    requirements: [
      'Personalausweis oder Reisepass',
      'Wohnungsgeberbestätigung',
      'Bei Einzug mehrerer Personen: Vollmacht'
    ],
    process: [
      'Formular online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Digitale Bestätigung der Ummeldung erhalten'
    ],
    fees: {
      standard: 'Kostenlos'
    },
    processingTime: '1-3 Werktage',
    faq: [
      {
        question: 'Was ist eine Wohnungsgeberbestätigung?',
        answer: 'Die Wohnungsgeberbestätigung ist ein Formular, das vom Vermieter oder Eigentümer der neuen Wohnung ausgefüllt wird, um den Einzug zu bestätigen.'
      },
      {
        question: 'Muss ich mich persönlich ummelden?',
        answer: 'Mit diesem digitalen Service können Sie die Ummeldung komplett online erledigen, ohne persönlich erscheinen zu müssen.'
      }
    ]
  },
  'buergergeld': {
    id: 'buergergeld',
    title: 'Bürgergeld',
    description: 'Beantragen Sie finanzielle Unterstützung bei Arbeitslosigkeit oder niedrigem Einkommen.',
    icon: '💶',
    longDescription: 'Das Bürgergeld ist eine staatliche Leistung für Personen, die arbeitsfähig sind, aber nicht genug für ihren Lebensunterhalt verdienen oder arbeitslos sind.',
    requirements: [
      'Wohnsitz in Deutschland',
      'Arbeitslos oder geringes Einkommen',
      'Einkommens- und Vermögensnachweise',
      'Mietvertrag und Nachweise zu Wohnkosten',
      'Kontoauszüge der letzten 3 Monate'
    ],
    process: [
      'Antrag online ausfüllen',
      'Notwendige Nachweise hochladen',
      'Digitale Bestätigung über Eingang des Antrags',
      'Bei Bedarf: Nachreichung weiterer Unterlagen',
      'Bescheid digital erhalten'
    ],
    fees: {
      standard: 'Kostenlos'
    },
    processingTime: '2-4 Wochen',
    faq: [
      {
        question: 'Wie hoch ist das Bürgergeld?',
        answer: 'Die Höhe des Bürgergeldes hängt von Ihrer persönlichen Situation ab, wie z.B. Alter, Wohnsituation und Anzahl der im Haushalt lebenden Personen.'
      },
      {
        question: 'Muss ich dem Arbeitsmarkt zur Verfügung stehen?',
        answer: 'Ja, grundsätzlich müssen Empfänger von Bürgergeld dem Arbeitsmarkt zur Verfügung stehen und aktiv nach Arbeit suchen.'
      }
    ]
  },
  'vehicle-registration': {
    id: 'vehicle-registration',
    title: 'Kfz-Zulassung',
    description: 'Registrieren Sie Ihr Fahrzeug oder ändern Sie die Zulassung',
    icon: '🚗',
    longDescription: 'Die Kfz-Zulassung ist ein wichtiger administrativer Vorgang für jedes Fahrzeug in Deutschland. Er umfasst die amtliche Registrierung und Genehmigung zur Nutzung eines Fahrzeugs im Straßenverkehr.',
    requirements: [
      'Personalausweis oder Reisepass',
      'Fahrzeugpapiere (Fahrzeugbrief und -schein oder Zulassungsbescheinigung Teil I und II)',
      'Nachweis über Hauptuntersuchung (TÜV)',
      'Nachweis über Kfz-Haftpflichtversicherung (eVB-Nummer)',
      'SEPA-Lastschriftmandat für die Kfz-Steuer'
    ],
    process: [
      'Formular online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Kennzeichen auswählen (falls erforderlich)',
      'Gebühren online bezahlen',
      'Zulassungsbescheinigung digital erhalten',
      'Kennzeichen und Plaketten per Post bekommen oder vor Ort abholen'
    ],
    fees: {
      standard: '26,00 € - 40,00 €',
      express: '50,00 €'
    },
    processingTime: '1-3 Werktage (Standard), 24 Stunden (Express)',
    faq: [
      {
        question: 'Kann ich ein Wunschkennzeichen beantragen?',
        answer: 'Ja, Sie können ein Wunschkennzeichen beantragen, sofern dieses noch verfügbar ist. Hierfür fällt eine zusätzliche Gebühr an.'
      },
      {
        question: 'Was ist eine eVB-Nummer?',
        answer: 'Die elektronische Versicherungsbestätigungsnummer (eVB) ist ein Nachweis über den Abschluss einer Kfz-Haftpflichtversicherung, den Sie von Ihrer Versicherung erhalten.'
      },
      {
        question: 'Kann ich mein Fahrzeug auch abmelden?',
        answer: 'Ja, auch die Abmeldung eines Fahrzeugs kann über diesen digitalen Service erfolgen.'
      }
    ]
  },
  'birth-certificate': {
    id: 'birth-certificate',
    title: 'Geburtsurkunde',
    description: 'Beantragen Sie eine Geburtsurkunde',
    icon: '👶',
    longDescription: 'Die Geburtsurkunde ist ein amtliches Dokument, das die Geburt einer Person beurkundet. Sie wird vom Standesamt ausgestellt und ist für verschiedene behördliche Angelegenheiten erforderlich.',
    requirements: [
      'Personalausweis oder Reisepass des Antragstellers',
      'Bei Beantragung für eine andere Person: Vollmacht',
      'Angaben zum Geburtsdatum und -ort',
      'Bei Beantragung für ein neugeborenes Kind: Bescheinigung über die Geburt vom Krankenhaus'
    ],
    process: [
      'Antrag online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Gebühren online bezahlen',
      'Digitale Bestätigung über Eingang des Antrags',
      'Urkunde per Post erhalten oder digital abrufen'
    ],
    fees: {
      standard: '12,00 €',
      additionalCopies: '6,00 € pro Stück',
      international: '22,00 €'
    },
    processingTime: '3-5 Werktage',
    faq: [
      {
        question: 'Wer kann eine Geburtsurkunde beantragen?',
        answer: 'Die Person selbst, Eltern für ihre Kinder, direkte Verwandte oder bevollmächtigte Personen können eine Geburtsurkunde beantragen.'
      },
      {
        question: 'Wie lange ist eine Geburtsurkunde gültig?',
        answer: 'Eine Geburtsurkunde hat grundsätzlich keine Gültigkeitsdauer. Für bestimmte Zwecke kann jedoch ein aktueller Auszug verlangt werden.'
      },
      {
        question: 'Kann ich eine mehrsprachige Geburtsurkunde beantragen?',
        answer: 'Ja, für internationale Zwecke können Sie eine mehrsprachige Geburtsurkunde beantragen.'
      }
    ]
  },
  'marriage-certificate': {
    id: 'marriage-certificate',
    title: 'Eheurkunde',
    description: 'Beantragen Sie eine Eheurkunde',
    icon: '💍',
    longDescription: 'Die Eheurkunde ist ein amtliches Dokument, das die Eheschließung zweier Personen beurkundet. Sie wird vom Standesamt ausgestellt und ist für verschiedene rechtliche und administrative Zwecke erforderlich.',
    requirements: [
      'Personalausweis oder Reisepass des Antragstellers',
      'Angaben zum Datum und Ort der Eheschließung',
      'Bei Beantragung für eine andere Person: Vollmacht',
      'Nachweis der Verwandtschaft bei verstorbenen Eheleuten'
    ],
    process: [
      'Antrag online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Gebühren online bezahlen',
      'Digitale Bestätigung über Eingang des Antrags',
      'Urkunde per Post erhalten oder digital abrufen'
    ],
    fees: {
      standard: '12,00 €',
      additionalCopies: '6,00 € pro Stück',
      international: '22,00 €'
    },
    processingTime: '3-5 Werktage',
    faq: [
      {
        question: 'Wer kann eine Eheurkunde beantragen?',
        answer: 'Die Eheleute selbst, direkte Verwandte oder bevollmächtigte Personen können eine Eheurkunde beantragen.'
      },
      {
        question: 'Benötige ich eine Eheurkunde für die Namensänderung nach der Heirat?',
        answer: 'Ja, für die Änderung des Namens in offiziellen Dokumenten benötigen Sie üblicherweise eine Eheurkunde.'
      },
      {
        question: 'Kann ich eine mehrsprachige Eheurkunde beantragen?',
        answer: 'Ja, für internationale Zwecke können Sie eine mehrsprachige Eheurkunde beantragen.'
      }
    ]
  },
  'business-registration': {
    id: 'business-registration',
    title: 'Gewerbeanmeldung',
    description: 'Registrieren Sie ein neues Gewerbe',
    icon: '🏢',
    longDescription: 'Die Gewerbeanmeldung ist ein offizieller Vorgang, bei dem ein Unternehmen oder eine selbständige Tätigkeit bei der zuständigen Behörde angemeldet wird. Dies ist in Deutschland vor Aufnahme einer gewerblichen Tätigkeit gesetzlich vorgeschrieben.',
    requirements: [
      'Personalausweis oder Reisepass',
      'Bei Ausländern: Aufenthaltstitel mit Erlaubnis zur selbständigen Tätigkeit',
      'Steuerliche Identifikationsnummer',
      'Bei bestimmten Gewerben: Nachweise über besondere Qualifikationen oder Genehmigungen',
      'Bei juristischen Personen: Handelsregisterauszug und Gesellschaftervertrag'
    ],
    process: [
      'Formular online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Gebühren online bezahlen',
      'Digitale Bestätigung über Eingang der Anmeldung',
      'Gewerbeschein digital erhalten oder per Post bekommen'
    ],
    fees: {
      standard: '15,00 € - 65,00 €',
      specialPermits: 'Zusätzliche Gebühren je nach Gewerbe'
    },
    processingTime: '1-3 Werktage',
    faq: [
      {
        question: 'Muss jede selbständige Tätigkeit angemeldet werden?',
        answer: 'Nein, freiberufliche Tätigkeiten (z.B. Ärzte, Rechtsanwälte, Künstler) benötigen keine Gewerbeanmeldung, müssen sich aber beim Finanzamt anmelden.'
      },
      {
        question: 'Welche weiteren Stellen werden über meine Gewerbeanmeldung informiert?',
        answer: 'Das Gewerbeamt leitet Ihre Anmeldung automatisch an das Finanzamt, die IHK oder HWK, die Berufsgenossenschaft und ggf. weitere Behörden weiter.'
      },
      {
        question: 'Was passiert, wenn ich mein Gewerbe nicht anmelde?',
        answer: 'Gewerbliche Tätigkeiten ohne Anmeldung sind Ordnungswidrigkeiten und können mit Bußgeldern geahndet werden.'
      }
    ]
  },
  'parental-allowance': {
    id: 'parental-allowance',
    title: 'Elterngeld',
    description: 'Beantragen Sie finanzielle Unterstützung für Eltern',
    icon: '👪',
    longDescription: 'Das Elterngeld ist eine staatliche Leistung für Eltern, die ihr Kind nach der Geburt selbst betreuen und erziehen und daher nicht oder nicht voll erwerbstätig sind. Es soll den Einkommenswegfall nach der Geburt eines Kindes auffangen.',
    requirements: [
      'Wohnsitz oder gewöhnlicher Aufenthalt in Deutschland',
      'Kind lebt im eigenen Haushalt',
      'Betreuung und Erziehung des Kindes selbst',
      'Keine oder reduzierte Erwerbstätigkeit (max. 32 Stunden pro Woche)',
      'Geburtsurkunde des Kindes',
      'Einkommensnachweise der letzten 12 Monate vor der Geburt'
    ],
    process: [
      'Antrag online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Digitale Bestätigung über Eingang des Antrags',
      'Bei Bedarf: Nachreichung weiterer Unterlagen',
      'Bescheid digital erhalten'
    ],
    fees: {
      standard: 'Kostenlos'
    },
    processingTime: '4-6 Wochen',
    faq: [
      {
        question: 'Wie hoch ist das Elterngeld?',
        answer: 'Das Elterngeld beträgt zwischen 65% und 100% des entfallenden Nettoeinkommens, mindestens 300 Euro und höchstens 1.800 Euro monatlich.'
      },
      {
        question: 'Wie lange wird Elterngeld gezahlt?',
        answer: 'Elterngeld wird für 12 Monate gezahlt. Wenn beide Elternteile Elternzeit nehmen, kann der Bezugszeitraum auf 14 Monate verlängert werden (2 Partnermonate).'
      },
      {
        question: 'Kann ich während des Elterngeldbezugs arbeiten?',
        answer: 'Ja, Sie können bis zu 32 Stunden pro Woche arbeiten. Das erzielte Einkommen wird jedoch auf das Elterngeld angerechnet.'
      }
    ]
  },
  'building-permit': {
    id: 'building-permit',
    title: 'Baugenehmigung',
    description: 'Beantragen Sie eine Genehmigung für Bauvorhaben',
    icon: '🏗️',
    longDescription: 'Die Baugenehmigung ist eine behördliche Erlaubnis, ein Bauvorhaben durchzuführen. Sie stellt sicher, dass das Vorhaben den baurechtlichen Vorschriften entspricht und die öffentliche Sicherheit nicht gefährdet wird.',
    requirements: [
      'Eigentumsnachweise oder Einverständniserklärung des Eigentümers',
      'Lageplan und Flurkarte',
      'Bauzeichnungen (Grundrisse, Schnitte, Ansichten) im Maßstab 1:100',
      'Baubeschreibung und Flächenberechnung',
      'Statische Berechnungen',
      'Nachweis über Standsicherheit',
      'Energieeffizienznachweis'
    ],
    process: [
      'Antrag online ausfüllen',
      'Erforderliche Pläne und Dokumente hochladen',
      'Gebühren online bezahlen',
      'Eventuell Nachforderung weiterer Unterlagen',
      'Prüfung durch die Baubehörde',
      'Baugenehmigung digital erhalten'
    ],
    fees: {
      standard: 'Abhängig von den Baukosten, i.d.R. 0,5% bis 2% der Bausumme',
      minimum: '200,00 €'
    },
    processingTime: '1-3 Monate',
    faq: [
      {
        question: 'Benötige ich für jedes Bauvorhaben eine Baugenehmigung?',
        answer: 'Nein, kleinere Bauvorhaben wie Gartenhäuser oder bestimmte Anbauten können je nach Bundesland genehmigungsfrei sein. Informieren Sie sich vorab über die lokalen Vorschriften.'
      },
      {
        question: 'Wie lange ist eine Baugenehmigung gültig?',
        answer: 'In der Regel ist eine Baugenehmigung 3 Jahre gültig. Innerhalb dieser Zeit muss mit dem Bau begonnen werden, sonst verfällt die Genehmigung.'
      },
      {
        question: 'Kann ich Einspruch gegen eine abgelehnte Baugenehmigung einlegen?',
        answer: 'Ja, gegen einen ablehnenden Bescheid können Sie Widerspruch einlegen. Die Frist beträgt üblicherweise einen Monat nach Erhalt des Bescheids.'
      }
    ]
  },
  'dog-tax': {
    id: 'dog-tax',
    title: 'Hundesteuer',
    description: 'Melden Sie Ihren Hund an oder ab',
    icon: '🐕',
    longDescription: 'Die Hundesteuer ist eine kommunale Aufwandsteuer, die von Hundehaltern zu entrichten ist. Sie dient nicht primär dem Tierschutz, sondern ist eine allgemeine Einnahmequelle der Gemeinden.',
    requirements: [
      'Personalausweis oder Reisepass',
      'Nachweis über Microchip oder Tätowierung des Hundes',
      'Bei bestimmten Rassen: Nachweis über Hundehaftpflichtversicherung',
      'Bei Abmeldung: Nachweis über Abgabe, Umzug oder Tod des Hundes'
    ],
    process: [
      'Formular online ausfüllen',
      'Notwendige Dokumente hochladen',
      'Bestätigung über die Anmeldung erhalten',
      'Steuermarke per Post bekommen'
    ],
    fees: {
      standard: '60,00 € - 180,00 € jährlich (je nach Kommune)',
      secondDog: 'Oft höhere Steuer als für den ersten Hund',
      specialBreeds: 'Für bestimmte Rassen gelten erhöhte Steuersätze'
    },
    processingTime: '1-2 Wochen',
    faq: [
      {
        question: 'Ab wann muss ich meinen Hund anmelden?',
        answer: 'In der Regel müssen Sie Ihren Hund innerhalb von 14 Tagen nach Erwerb oder Einzug in die Gemeinde anmelden.'
      },
      {
        question: 'Gibt es Ermäßigungen oder Befreiungen von der Hundesteuer?',
        answer: 'Ja, für Blinden- und Assistenzhunde, Diensthunde oder in sozialen Härtefällen können Ermäßigungen oder Befreiungen gewährt werden.'
      },
      {
        question: 'Was passiert, wenn ich meinen Hund nicht anmelde?',
        answer: 'Die Nicht-Anmeldung eines Hundes ist eine Ordnungswidrigkeit, die mit einem Bußgeld geahndet werden kann. Zudem kann die Steuer rückwirkend erhoben werden.'
      }
    ]
  },
  'waste-collection': {
    id: 'waste-collection',
    title: 'Müllabfuhr',
    description: 'Beantragen oder ändern Sie Ihre Mülltonnen',
    icon: '🗑️',
    longDescription: 'Die Müllabfuhr ist ein kommunaler Service zur Entsorgung von Haushaltsabfällen. Über diesen digitalen Service können Sie die Anzahl und Art Ihrer Mülltonnen beantragen oder ändern sowie Informationen zu Abholzeiten erhalten.',
    requirements: [
      'Wohnanschrift',
      'Personalausweis oder Reisepass',
      'Bei Mietern: Bestätigung des Vermieters (optional)',
      'Bei Eigentümern: Eigentumsnachweis (optional)'
    ],
    process: [
      'Formular online ausfüllen',
      'Gewünschte Tonnenanzahl und -größe auswählen',
      'Servicezeitraum festlegen',
      'Bestätigung digital erhalten',
      'Lieferung der Tonnen zum angegebenen Termin'
    ],
    fees: {
      basic: 'Grundgebühr je nach Kommune',
      restmüll: '40,00 € - 350,00 € jährlich (je nach Größe und Abholrhythmus)',
      bio: '30,00 € - 150,00 € jährlich',
      papier: 'Oft kostenlos',
      wertstoff: '30,00 € - 120,00 € jährlich'
    },
    processingTime: '1-2 Wochen',
    faq: [
      {
        question: 'Kann ich die Größe meiner Mülltonne ändern?',
        answer: 'Ja, Sie können die Größe Ihrer Tonne je nach Bedarf ändern. Beachten Sie, dass viele Kommunen Mindestvolumen pro Person vorschreiben.'
      },
      {
        question: 'Was passiert bei Umzug mit meinen Mülltonnen?',
        answer: 'Bei Umzug müssen Sie Ihre Mülltonnen ab- und am neuen Wohnort wieder anmelden. Die Tonnen verbleiben in der Regel am alten Wohnort.'
      },
      {
        question: 'Gibt es spezielle Regelungen für Gewerbeabfälle?',
        answer: 'Ja, für gewerbliche Abfälle gelten besondere Bestimmungen und oft andere Gebühren. Bitte informieren Sie sich speziell zu gewerblichen Abfällen.'
      }
    ]
  }
  // Additional services would be added here...
})

const service = computed(() => {
  if (serviceDetails.value[serviceId]) {
    return serviceDetails.value[serviceId]
  }
  return null
})

const toggleAccordion = (index) => {
  if (accordionOpen.value === index) {
    accordionOpen.value = null
  } else {
    accordionOpen.value = index
  }
}

const startApplication = () => {
  router.push(`/apply/${serviceId}`)
}

onMounted(() => {
  // Simulate API loading
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="service-detail-view">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Lade Informationen...</p>
    </div>
    
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
    
    <div v-else class="service-container">
      <div class="service-header">
        <div class="back-link">
          <button 
            v-voix="'back-button'" 
            hint="Zurück zur vorherigen Seite"
            class="back-link-button" 
            @click="router.back()">
            &larr; Zurück
          </button>
        </div>
        
        <div class="service-title">
          <div class="service-icon">{{ service.icon }}</div>
          <h1>{{ service.title }}</h1>
        </div>
        
        <div class="service-actions">
          <button 
            v-voix="'start-application'" 
            hint="Beginnt den Antragsprozess für diese Dienstleistung"
            class="start-application" 
            @click="startApplication">
            Antrag starten
          </button>
        </div>
      </div>
      
      <div class="service-content">
        <div class="service-description">
          <p class="intro-text">{{ service.longDescription }}</p>
        </div>
        
        <div class="service-details">
          <div class="detail-section">
            <button 
              v-voix="'requirements-accordion'" 
              hint="Zeigt oder versteckt die Voraussetzungen für diesen Antrag"
              class="accordion-button" 
              :class="{ active: accordionOpen === 0 }" 
              @click="toggleAccordion(0)">
              <h2>Voraussetzungen</h2>
              <span class="accordion-icon">{{ accordionOpen === 0 ? '−' : '+' }}</span>
            </button>
            
            <div class="accordion-content" :class="{ open: accordionOpen === 0 }">
              <ul class="requirements-list">
                <li v-for="(requirement, index) in service.requirements" :key="index">
                  {{ requirement }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="detail-section">
            <button 
              v-voix="'process-accordion'" 
              hint="Zeigt oder versteckt die Prozessschritte für diesen Antrag"
              class="accordion-button" 
              :class="{ active: accordionOpen === 1 }" 
              @click="toggleAccordion(1)">
              <h2>Ablauf</h2>
              <span class="accordion-icon">{{ accordionOpen === 1 ? '−' : '+' }}</span>
            </button>
            
            <div class="accordion-content" :class="{ open: accordionOpen === 1 }">
              <ol class="process-list">
                <li v-for="(step, index) in service.process" :key="index">
                  {{ step }}
                </li>
              </ol>
            </div>
          </div>
          
          <div class="detail-section">
            <button 
              v-voix="'fees-accordion'" 
              hint="Zeigt oder versteckt die Gebühren für diesen Antrag"
              class="accordion-button" 
              :class="{ active: accordionOpen === 2 }" 
              @click="toggleAccordion(2)">
              <h2>Gebühren</h2>
              <span class="accordion-icon">{{ accordionOpen === 2 ? '−' : '+' }}</span>
            </button>
            
            <div class="accordion-content" :class="{ open: accordionOpen === 2 }">
              <div class="fees-container">
                <div v-for="(fee, key) in service.fees" :key="key" class="fee-item">
                  <span class="fee-label">{{ key === 'standard' ? 'Standard' : 
                    key === 'express' ? 'Express-Bearbeitung' : 
                    key === 'underAge24' ? 'Unter 24 Jahren' : key }}</span>
                  <span class="fee-value">{{ fee }}</span>
                </div>
                
                <div class="processing-time">
                  <span class="processing-label">Bearbeitungszeit:</span>
                  <span class="processing-value">{{ service.processingTime }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <button 
              v-voix="'faq-accordion'" 
              hint="Zeigt oder versteckt häufig gestellte Fragen zu diesem Antrag"
              class="accordion-button" 
              :class="{ active: accordionOpen === 3 }" 
              @click="toggleAccordion(3)">
              <h2>Häufige Fragen</h2>
              <span class="accordion-icon">{{ accordionOpen === 3 ? '−' : '+' }}</span>
            </button>
            
            <div class="accordion-content" :class="{ open: accordionOpen === 3 }">
              <div class="faq-container">
                <div v-for="(item, index) in service.faq" :key="index" class="faq-item">
                  <h3 class="faq-question">{{ item.question }}</h3>
                  <p class="faq-answer">{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="cta-container">
          <p>Bereit, Ihren Antrag zu starten?</p>
          <button 
            v-voix="'bottom-start-application'" 
            hint="Beginnt den Antragsprozess für diese Dienstleistung"
            class="start-application large" 
            @click="startApplication">
            Jetzt beantragen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-detail-view {
  animation: fadeIn 0.5s ease-out;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

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

.service-container {
  max-width: 800px;
  margin: 0 auto;
}

.service-header {
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

.service-title {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.service-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.service-title h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0;
}

.start-application {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.start-application:hover {
  background-color: var(--secondary-color);
}

.start-application.large {
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.service-description {
  margin-bottom: 2rem;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.detail-section {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.accordion-button {
  width: 100%;
  text-align: left;
  background-color: var(--card-background);
  padding: 1rem;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.accordion-button:hover {
  background-color: var(--border-color);
}

.accordion-button.active {
  background-color: var(--primary-color);
  color: white;
}

.accordion-button h2 {
  margin: 0;
  font-size: 1.25rem;
}

.accordion-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-speed);
}

.accordion-content.open {
  max-height: 500px;
}

.requirements-list, .process-list {
  padding: 1rem 2rem;
}

.requirements-list li, .process-list li {
  margin-bottom: 0.75rem;
}

.fees-container {
  padding: 1rem;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.processing-time {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-top: 1rem;
  font-weight: bold;
}

.faq-container {
  padding: 1rem;
}

.faq-item {
  margin-bottom: 1.5rem;
}

.faq-question {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.cta-container {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.cta-container p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
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
  .service-title {
    flex-direction: column;
    text-align: center;
  }
  
  .service-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .service-title h1 {
    font-size: 1.75rem;
  }
  
  .start-application.large {
    width: 100%;
  }
}
</style>