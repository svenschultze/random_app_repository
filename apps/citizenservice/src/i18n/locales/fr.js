export default {
  common: {
    appName: 'Service Citoyen Numérique',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Soumettre',
    cancel: 'Annuler',
    save: 'Enregistrer',
    loading: 'Chargement...',
    search: 'Rechercher',
    notFound: 'Non trouvé',
    yes: 'Oui',
    no: 'Non',
    required: 'Obligatoire',
    error: 'Erreur',
    success: 'Succès',
    close: 'Fermer'
  },
  nav: {
    home: 'Accueil',
    services: 'Services',
    dashboard: 'Mon espace',
    help: 'Aide',
    about: 'À propos',
    language: 'Langue',
    theme: {
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système'
    }
  },
  home: {
    title: 'Bienvenue au Service Citoyen Numérique',
    subtitle: 'Votre portail numérique pour les services gouvernementaux',
    popularServices: 'Services populaires',
    allServices: 'Tous les services',
    searchPlaceholder: 'Rechercher un service...',
    welcomeMessage: 'Effectuez vos démarches administratives confortablement depuis chez vous.'
  },
  services: {
    title: 'Services',
    subtitle: 'Trouvez tous les services gouvernementaux numériques en un seul endroit',
    searchPlaceholder: 'Rechercher un service...',
    allServices: 'Tous les services',
    noResults: 'Aucun service trouvé.',
    resetFilters: 'Réinitialiser les filtres',
    details: 'Voir les détails',
    categories: {
      all: 'Tous les services',
      documents: 'Identité & Documents',
      residence: 'Résidence & Déménagement',
      social: 'Prestations sociales',
      mobility: 'Mobilité & Transport',
      business: 'Entreprises & Commerce',
      housing: 'Construction & Logement',
      taxes: 'Impôts & Taxes'
    }
  },
  serviceDetail: {
    notFound: 'Service non trouvé',
    notFoundSubtitle: 'Le service demandé n\'a pas pu être trouvé.',
    backToServices: 'Retour à l\'aperçu',
    requirements: 'Conditions requises',
    process: 'Processus',
    fees: 'Frais',
    faq: 'Questions fréquentes',
    processingTime: 'Délai de traitement',
    startApplication: 'Commencer la demande',
    readyToApply: 'Prêt à commencer votre demande ?',
    applyNow: 'Postuler maintenant'
  },
  application: {
    title: 'Demande : {service}',
    personalData: 'Données personnelles',
    documents: 'Documents',
    confirmation: 'Confirmation',
    summary: 'Résumé',
    successTitle: 'Votre demande a été soumise avec succès !',
    successMessage: 'Vous serez bientôt redirigé vers votre espace personnel où vous pourrez suivre l\'état de votre demande.',
    personalInfo: {
      salutation: 'Civilité',
      firstName: 'Prénom',
      lastName: 'Nom',
      dateOfBirth: 'Date de naissance',
      placeOfBirth: 'Lieu de naissance',
      nationality: 'Nationalité',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      street: 'Rue',
      houseNumber: 'Numéro',
      postalCode: 'Code postal',
      city: 'Ville'
    },
    documentUpload: {
      title: 'Télécharger des documents',
      formats: 'Formats acceptés',
      uploadButton: 'Télécharger un document',
      noDocuments: 'Aucun document téléchargé.'
    },
    terms: {
      title: 'Consentement',
      agreeToTerms: 'J\'accepte les conditions d\'utilisation.',
      agreeToDataProcessing: 'J\'accepte le traitement de mes données conformément à la politique de confidentialité.'
    }
  },
  dashboard: {
    title: 'Mon espace',
    welcome: 'Bienvenue, {name} !',
    applications: 'Mes demandes',
    notifications: 'Notifications',
    profile: 'Profil',
    noApplications: 'Vous n\'avez pas encore soumis de demandes.',
    applicationStatus: {
      submitted: 'Soumise',
      inProgress: 'En cours',
      awaitingDocuments: 'Documents en attente',
      approved: 'Approuvée',
      rejected: 'Rejetée',
      completed: 'Terminée'
    }
  },
  help: {
    title: 'Aide',
    faq: 'Questions fréquentes',
    contact: 'Contact',
    chatbot: 'Discuter avec notre assistant',
    guide: 'Guide d\'utilisation',
    askQuestion: 'Poser une question',
    searchHelp: 'Rechercher des sujets d\'aide',
    contactForm: {
      name: 'Nom',
      email: 'E-mail',
      message: 'Message',
      subject: 'Sujet',
      send: 'Envoyer le message'
    }
  },
  about: {
    title: 'À propos',
    mission: 'Notre mission',
    team: 'Notre équipe',
    contact: 'Contact',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
    accessibility: 'Accessibilité'
  },
  errors: {
    required: 'Ce champ est obligatoire.',
    email: 'Veuillez entrer une adresse e-mail valide.',
    phone: 'Veuillez entrer un numéro de téléphone valide.',
    minLength: 'Veuillez entrer au moins {min} caractères.',
    maxLength: 'Veuillez entrer au maximum {max} caractères.',
    fieldRequired: 'Veuillez remplir ce champ.',
    fileSize: 'Le fichier est trop volumineux. Taille maximale : {size} Mo.',
    fileFormat: 'Format de fichier non valide. Formats autorisés : {formats}.'
  }
}