export default {
  common: {
    appName: 'CitizenService Digital',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    search: 'Search',
    notFound: 'Not found',
    yes: 'Yes',
    no: 'No',
    required: 'Required',
    error: 'Error',
    success: 'Success',
    close: 'Close'
  },
  nav: {
    home: 'Home',
    services: 'Services',
    dashboard: 'My Dashboard',
    help: 'Help',
    about: 'About',
    language: 'Language',
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    }
  },
  home: {
    title: 'Welcome to CitizenService Digital',
    subtitle: 'Your digital gateway to government services',
    popularServices: 'Popular Services',
    allServices: 'All Services',
    searchPlaceholder: 'Search for a service...',
    welcomeMessage: 'Complete government procedures conveniently from home.'
  },
  services: {
    title: 'Services',
    subtitle: 'Find all digital government services in one place',
    searchPlaceholder: 'Search for a service...',
    allServices: 'All Services',
    noResults: 'No services found.',
    resetFilters: 'Reset filters',
    details: 'View details',
    categories: {
      all: 'All Services',
      documents: 'ID & Documents',
      residence: 'Residence & Moving',
      social: 'Social Benefits',
      mobility: 'Mobility & Transport',
      business: 'Business & Trade',
      housing: 'Building & Housing',
      taxes: 'Taxes & Fees'
    }
  },
  serviceDetail: {
    notFound: 'Service not found',
    notFoundSubtitle: 'The requested service could not be found.',
    backToServices: 'Back to overview',
    requirements: 'Requirements',
    process: 'Process',
    fees: 'Fees',
    faq: 'Frequently Asked Questions',
    processingTime: 'Processing time',
    startApplication: 'Start application',
    readyToApply: 'Ready to start your application?',
    applyNow: 'Apply now'
  },
  application: {
    title: 'Application: {service}',
    personalData: 'Personal Data',
    documents: 'Documents',
    confirmation: 'Confirmation',
    summary: 'Summary',
    successTitle: 'Your application has been submitted successfully!',
    successMessage: 'You will soon be redirected to your personal dashboard where you can track the status of your application.',
    personalInfo: {
      salutation: 'Salutation',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      placeOfBirth: 'Place of Birth',
      nationality: 'Nationality',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      street: 'Street',
      houseNumber: 'House Number',
      postalCode: 'Postal Code',
      city: 'City'
    },
    documentUpload: {
      title: 'Upload Documents',
      formats: 'Accepted formats',
      uploadButton: 'Upload document',
      noDocuments: 'No documents uploaded.'
    },
    terms: {
      title: 'Consent',
      agreeToTerms: 'I agree to the terms of service.',
      agreeToDataProcessing: 'I agree to the processing of my data according to the privacy policy.'
    }
  },
  dashboard: {
    title: 'My Dashboard',
    welcome: 'Welcome, {name}!',
    applications: 'My Applications',
    notifications: 'Notifications',
    profile: 'Profile',
    noApplications: 'You have not submitted any applications yet.',
    applicationStatus: {
      submitted: 'Submitted',
      inProgress: 'In Progress',
      awaitingDocuments: 'Awaiting Documents',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed'
    }
  },
  help: {
    title: 'Help',
    faq: 'Frequently Asked Questions',
    contact: 'Contact',
    chatbot: 'Chat with our assistant',
    guide: 'How to use',
    askQuestion: 'Ask a question',
    searchHelp: 'Search help topics',
    contactForm: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      subject: 'Subject',
      send: 'Send message'
    }
  },
  about: {
    title: 'About Us',
    mission: 'Our Mission',
    team: 'Our Team',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    accessibility: 'Accessibility'
  },
  errors: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number.',
    minLength: 'Please enter at least {min} characters.',
    maxLength: 'Please enter no more than {max} characters.',
    fieldRequired: 'Please fill out this field.',
    fileSize: 'The file is too large. Maximum size: {size}MB.',
    fileFormat: 'Invalid file format. Allowed formats: {formats}.'
  }
}