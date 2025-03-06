export default {
  common: {
    appName: 'Servicio Ciudadano Digital',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    loading: 'Cargando...',
    search: 'Buscar',
    notFound: 'No encontrado',
    yes: 'Sí',
    no: 'No',
    required: 'Obligatorio',
    error: 'Error',
    success: 'Éxito',
    close: 'Cerrar'
  },
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    dashboard: 'Mi área',
    help: 'Ayuda',
    about: 'Acerca de',
    language: 'Idioma',
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema'
    }
  },
  home: {
    title: 'Bienvenido al Servicio Ciudadano Digital',
    subtitle: 'Su portal digital para servicios gubernamentales',
    popularServices: 'Servicios populares',
    allServices: 'Todos los servicios',
    searchPlaceholder: 'Buscar un servicio...',
    welcomeMessage: 'Complete trámites gubernamentales cómodamente desde su casa.'
  },
  services: {
    title: 'Servicios',
    subtitle: 'Encuentre todos los servicios gubernamentales digitales en un solo lugar',
    searchPlaceholder: 'Buscar un servicio...',
    allServices: 'Todos los servicios',
    noResults: 'No se encontraron servicios.',
    resetFilters: 'Restablecer filtros',
    details: 'Ver detalles',
    categories: {
      all: 'Todos los servicios',
      documents: 'Identidad y documentos',
      residence: 'Residencia y mudanza',
      social: 'Beneficios sociales',
      mobility: 'Movilidad y transporte',
      business: 'Empresas y comercio',
      housing: 'Construcción y vivienda',
      taxes: 'Impuestos y tasas'
    }
  },
  serviceDetail: {
    notFound: 'Servicio no encontrado',
    notFoundSubtitle: 'El servicio solicitado no pudo ser encontrado.',
    backToServices: 'Volver a la visión general',
    requirements: 'Requisitos',
    process: 'Proceso',
    fees: 'Tarifas',
    faq: 'Preguntas frecuentes',
    processingTime: 'Tiempo de procesamiento',
    startApplication: 'Iniciar solicitud',
    readyToApply: '¿Listo para iniciar su solicitud?',
    applyNow: 'Solicitar ahora'
  },
  application: {
    title: 'Solicitud: {service}',
    personalData: 'Datos personales',
    documents: 'Documentos',
    confirmation: 'Confirmación',
    summary: 'Resumen',
    successTitle: '¡Su solicitud ha sido enviada con éxito!',
    successMessage: 'Pronto será redirigido a su área personal donde podrá seguir el estado de su solicitud.',
    personalInfo: {
      salutation: 'Tratamiento',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      dateOfBirth: 'Fecha de nacimiento',
      placeOfBirth: 'Lugar de nacimiento',
      nationality: 'Nacionalidad',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      street: 'Calle',
      houseNumber: 'Número',
      postalCode: 'Código postal',
      city: 'Ciudad'
    },
    documentUpload: {
      title: 'Subir documentos',
      formats: 'Formatos aceptados',
      uploadButton: 'Subir documento',
      noDocuments: 'No se han subido documentos.'
    },
    terms: {
      title: 'Consentimiento',
      agreeToTerms: 'Acepto los términos de servicio.',
      agreeToDataProcessing: 'Acepto el procesamiento de mis datos según la política de privacidad.'
    }
  },
  dashboard: {
    title: 'Mi área',
    welcome: '¡Bienvenido, {name}!',
    applications: 'Mis solicitudes',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    noApplications: 'Aún no ha enviado ninguna solicitud.',
    applicationStatus: {
      submitted: 'Enviada',
      inProgress: 'En proceso',
      awaitingDocuments: 'Esperando documentos',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      completed: 'Completada'
    }
  },
  help: {
    title: 'Ayuda',
    faq: 'Preguntas frecuentes',
    contact: 'Contacto',
    chatbot: 'Chat con nuestro asistente',
    guide: 'Guía de uso',
    askQuestion: 'Hacer una pregunta',
    searchHelp: 'Buscar temas de ayuda',
    contactForm: {
      name: 'Nombre',
      email: 'Correo electrónico',
      message: 'Mensaje',
      subject: 'Asunto',
      send: 'Enviar mensaje'
    }
  },
  about: {
    title: 'Acerca de nosotros',
    mission: 'Nuestra misión',
    team: 'Nuestro equipo',
    contact: 'Contacto',
    privacy: 'Política de privacidad',
    terms: 'Términos de servicio',
    accessibility: 'Accesibilidad'
  },
  errors: {
    required: 'Este campo es obligatorio.',
    email: 'Por favor, introduzca una dirección de correo electrónico válida.',
    phone: 'Por favor, introduzca un número de teléfono válido.',
    minLength: 'Por favor, introduzca al menos {min} caracteres.',
    maxLength: 'Por favor, introduzca no más de {max} caracteres.',
    fieldRequired: 'Por favor, complete este campo.',
    fileSize: 'El archivo es demasiado grande. Tamaño máximo: {size}MB.',
    fileFormat: 'Formato de archivo no válido. Formatos permitidos: {formats}.'
  }
}