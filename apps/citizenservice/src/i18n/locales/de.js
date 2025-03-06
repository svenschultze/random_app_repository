export default {
  common: {
    appName: 'BehördenService Digital',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Absenden',
    cancel: 'Abbrechen',
    save: 'Speichern',
    loading: 'Lade...',
    search: 'Suchen',
    notFound: 'Nicht gefunden',
    yes: 'Ja',
    no: 'Nein',
    required: 'Erforderlich',
    error: 'Fehler',
    success: 'Erfolg',
    close: 'Schließen'
  },
  nav: {
    home: 'Startseite',
    services: 'Dienstleistungen',
    dashboard: 'Mein Bereich',
    help: 'Hilfe',
    about: 'Über uns',
    language: 'Sprache',
    theme: {
      light: 'Hell',
      dark: 'Dunkel',
      system: 'System'
    }
  },
  home: {
    title: 'Willkommen bei BehördenService Digital',
    subtitle: 'Ihre digitale Anlaufstelle für Behördengänge',
    popularServices: 'Beliebte Dienstleistungen',
    allServices: 'Alle Dienstleistungen',
    searchPlaceholder: 'Suchen Sie nach einer Dienstleistung...',
    welcomeMessage: 'Erledigen Sie Behördengänge bequem von zu Hause aus.'
  },
  services: {
    title: 'Dienstleistungen',
    subtitle: 'Finden Sie alle digitalen Behördendienste an einem Ort',
    searchPlaceholder: 'Suchen Sie nach einer Dienstleistung...',
    allServices: 'Alle Dienstleistungen',
    noResults: 'Keine Dienstleistungen gefunden.',
    resetFilters: 'Filter zurücksetzen',
    details: 'Details anzeigen',
    categories: {
      all: 'Alle Dienste',
      documents: 'Ausweise & Dokumente',
      residence: 'Wohnen & Umzug',
      social: 'Sozialleistungen',
      mobility: 'Mobilität & Verkehr',
      business: 'Wirtschaft & Gewerbe',
      housing: 'Bauen & Wohnen',
      taxes: 'Steuern & Abgaben'
    }
  },
  serviceDetail: {
    notFound: 'Dienst nicht gefunden',
    notFoundSubtitle: 'Der angeforderte Dienst konnte nicht gefunden werden.',
    backToServices: 'Zurück zur Übersicht',
    requirements: 'Voraussetzungen',
    process: 'Ablauf',
    fees: 'Gebühren',
    faq: 'Häufige Fragen',
    processingTime: 'Bearbeitungszeit',
    startApplication: 'Antrag starten',
    readyToApply: 'Bereit, Ihren Antrag zu starten?',
    applyNow: 'Jetzt beantragen'
  },
  application: {
    title: 'Antrag: {service}',
    personalData: 'Persönliche Daten',
    documents: 'Dokumente',
    confirmation: 'Bestätigung',
    summary: 'Zusammenfassung',
    successTitle: 'Ihr Antrag wurde erfolgreich eingereicht!',
    successMessage: 'Sie werden in Kürze zu Ihrem persönlichen Bereich weitergeleitet, wo Sie den Status Ihres Antrags verfolgen können.',
    personalInfo: {
      salutation: 'Anrede',
      firstName: 'Vorname',
      lastName: 'Nachname',
      dateOfBirth: 'Geburtsdatum',
      placeOfBirth: 'Geburtsort',
      nationality: 'Staatsangehörigkeit',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      street: 'Straße',
      houseNumber: 'Hausnummer',
      postalCode: 'PLZ',
      city: 'Ort'
    },
    documentUpload: {
      title: 'Dokumente hochladen',
      formats: 'Akzeptierte Formate',
      uploadButton: 'Dokument hochladen',
      noDocuments: 'Keine Dokumente hochgeladen.'
    },
    terms: {
      title: 'Einwilligungen',
      agreeToTerms: 'Ich stimme den Nutzungsbedingungen zu.',
      agreeToDataProcessing: 'Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.'
    }
  },
  dashboard: {
    title: 'Mein Bereich',
    welcome: 'Willkommen, {name}!',
    applications: 'Meine Anträge',
    notifications: 'Benachrichtigungen',
    profile: 'Profil',
    noApplications: 'Sie haben noch keine Anträge gestellt.',
    applicationStatus: {
      submitted: 'Eingereicht',
      inProgress: 'In Bearbeitung',
      awaitingDocuments: 'Dokumente ausstehend',
      approved: 'Genehmigt',
      rejected: 'Abgelehnt',
      completed: 'Abgeschlossen'
    }
  },
  help: {
    title: 'Hilfe',
    faq: 'Häufig gestellte Fragen',
    contact: 'Kontakt',
    chatbot: 'Chat mit unserem Assistenten',
    guide: 'Anleitung zur Nutzung',
    askQuestion: 'Frage stellen',
    searchHelp: 'Hilfethemen durchsuchen',
    contactForm: {
      name: 'Name',
      email: 'E-Mail',
      message: 'Nachricht',
      subject: 'Betreff',
      send: 'Nachricht senden'
    }
  },
  about: {
    title: 'Über uns',
    mission: 'Unsere Mission',
    team: 'Unser Team',
    contact: 'Kontakt',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    accessibility: 'Barrierefreiheit'
  },
  errors: {
    required: 'Dieses Feld ist erforderlich.',
    email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    phone: 'Bitte geben Sie eine gültige Telefonnummer ein.',
    minLength: 'Bitte geben Sie mindestens {min} Zeichen ein.',
    maxLength: 'Bitte geben Sie höchstens {max} Zeichen ein.',
    fieldRequired: 'Bitte füllen Sie dieses Feld aus.',
    fileSize: 'Die Datei ist zu groß. Maximale Größe: {size}MB.',
    fileFormat: 'Ungültiges Dateiformat. Erlaubte Formate: {formats}.'
  }
}