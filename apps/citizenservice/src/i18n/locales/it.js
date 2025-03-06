export default {
  common: {
    appName: 'Servizio Cittadino Digitale',
    back: 'Indietro',
    next: 'Avanti',
    submit: 'Invia',
    cancel: 'Annulla',
    save: 'Salva',
    loading: 'Caricamento...',
    search: 'Cerca',
    notFound: 'Non trovato',
    yes: 'Sì',
    no: 'No',
    required: 'Obbligatorio',
    error: 'Errore',
    success: 'Successo',
    close: 'Chiudi'
  },
  nav: {
    home: 'Home',
    services: 'Servizi',
    dashboard: 'Area personale',
    help: 'Aiuto',
    about: 'Chi siamo',
    language: 'Lingua',
    theme: {
      light: 'Chiaro',
      dark: 'Scuro',
      system: 'Sistema'
    }
  },
  home: {
    title: 'Benvenuto nel Servizio Cittadino Digitale',
    subtitle: 'Il tuo portale digitale per i servizi governativi',
    popularServices: 'Servizi popolari',
    allServices: 'Tutti i servizi',
    searchPlaceholder: 'Cerca un servizio...',
    welcomeMessage: 'Completa le procedure governative comodamente da casa tua.'
  },
  services: {
    title: 'Servizi',
    subtitle: 'Trova tutti i servizi governativi digitali in un unico posto',
    searchPlaceholder: 'Cerca un servizio...',
    allServices: 'Tutti i servizi',
    noResults: 'Nessun servizio trovato.',
    resetFilters: 'Reimposta filtri',
    details: 'Visualizza dettagli',
    categories: {
      all: 'Tutti i servizi',
      documents: 'Identità e documenti',
      residence: 'Residenza e trasferimento',
      social: 'Prestazioni sociali',
      mobility: 'Mobilità e trasporto',
      business: 'Imprese e commercio',
      housing: 'Costruzione e abitazione',
      taxes: 'Tasse e imposte'
    }
  },
  serviceDetail: {
    notFound: 'Servizio non trovato',
    notFoundSubtitle: 'Il servizio richiesto non è stato trovato.',
    backToServices: 'Torna alla panoramica',
    requirements: 'Requisiti',
    process: 'Processo',
    fees: 'Costi',
    faq: 'Domande frequenti',
    processingTime: 'Tempo di elaborazione',
    startApplication: 'Avvia richiesta',
    readyToApply: 'Pronto per iniziare la tua richiesta?',
    applyNow: 'Richiedi ora'
  },
  application: {
    title: 'Richiesta: {service}',
    personalData: 'Dati personali',
    documents: 'Documenti',
    confirmation: 'Conferma',
    summary: 'Riepilogo',
    successTitle: 'La tua richiesta è stata inviata con successo!',
    successMessage: 'Sarai presto reindirizzato alla tua area personale dove potrai seguire lo stato della tua richiesta.',
    personalInfo: {
      salutation: 'Titolo',
      firstName: 'Nome',
      lastName: 'Cognome',
      dateOfBirth: 'Data di nascita',
      placeOfBirth: 'Luogo di nascita',
      nationality: 'Nazionalità',
      email: 'Email',
      phone: 'Telefono',
      address: 'Indirizzo',
      street: 'Via',
      houseNumber: 'Numero civico',
      postalCode: 'Codice postale',
      city: 'Città'
    },
    documentUpload: {
      title: 'Carica documenti',
      formats: 'Formati accettati',
      uploadButton: 'Carica documento',
      noDocuments: 'Nessun documento caricato.'
    },
    terms: {
      title: 'Consenso',
      agreeToTerms: 'Accetto i termini di servizio.',
      agreeToDataProcessing: 'Accetto il trattamento dei miei dati secondo l\'informativa sulla privacy.'
    }
  },
  dashboard: {
    title: 'Area personale',
    welcome: 'Benvenuto, {name}!',
    applications: 'Le mie richieste',
    notifications: 'Notifiche',
    profile: 'Profilo',
    noApplications: 'Non hai ancora inviato alcuna richiesta.',
    applicationStatus: {
      submitted: 'Inviata',
      inProgress: 'In elaborazione',
      awaitingDocuments: 'In attesa di documenti',
      approved: 'Approvata',
      rejected: 'Respinta',
      completed: 'Completata'
    }
  },
  help: {
    title: 'Aiuto',
    faq: 'Domande frequenti',
    contact: 'Contatto',
    chatbot: 'Chat con il nostro assistente',
    guide: 'Guida all\'uso',
    askQuestion: 'Fai una domanda',
    searchHelp: 'Cerca argomenti di aiuto',
    contactForm: {
      name: 'Nome',
      email: 'Email',
      message: 'Messaggio',
      subject: 'Oggetto',
      send: 'Invia messaggio'
    }
  },
  about: {
    title: 'Chi siamo',
    mission: 'La nostra missione',
    team: 'Il nostro team',
    contact: 'Contatto',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di servizio',
    accessibility: 'Accessibilità'
  },
  errors: {
    required: 'Questo campo è obbligatorio.',
    email: 'Inserisci un indirizzo email valido.',
    phone: 'Inserisci un numero di telefono valido.',
    minLength: 'Inserisci almeno {min} caratteri.',
    maxLength: 'Inserisci al massimo {max} caratteri.',
    fieldRequired: 'Compila questo campo.',
    fileSize: 'Il file è troppo grande. Dimensione massima: {size}MB.',
    fileFormat: 'Formato file non valido. Formati consentiti: {formats}.'
  }
}