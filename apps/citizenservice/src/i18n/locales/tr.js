export default {
  common: {
    appName: 'Dijital Vatandaşlık Hizmeti',
    back: 'Geri',
    next: 'İleri',
    submit: 'Gönder',
    cancel: 'İptal',
    save: 'Kaydet',
    loading: 'Yükleniyor...',
    search: 'Ara',
    notFound: 'Bulunamadı',
    yes: 'Evet',
    no: 'Hayır',
    required: 'Zorunlu',
    error: 'Hata',
    success: 'Başarılı',
    close: 'Kapat'
  },
  nav: {
    home: 'Ana Sayfa',
    services: 'Hizmetler',
    dashboard: 'Hesabım',
    help: 'Yardım',
    about: 'Hakkımızda',
    language: 'Dil',
    theme: {
      light: 'Açık',
      dark: 'Koyu',
      system: 'Sistem'
    }
  },
  home: {
    title: 'Dijital Vatandaşlık Hizmetine Hoş Geldiniz',
    subtitle: 'Devlet hizmetleri için dijital portalınız',
    popularServices: 'Popüler Hizmetler',
    allServices: 'Tüm Hizmetler',
    searchPlaceholder: 'Bir hizmet arayın...',
    welcomeMessage: 'Devlet işlemlerinizi evinizden rahatça tamamlayın.'
  },
  services: {
    title: 'Hizmetler',
    subtitle: 'Tüm dijital devlet hizmetlerini tek bir yerde bulun',
    searchPlaceholder: 'Bir hizmet arayın...',
    allServices: 'Tüm Hizmetler',
    noResults: 'Hizmet bulunamadı.',
    resetFilters: 'Filtreleri sıfırla',
    details: 'Detayları görüntüle',
    categories: {
      all: 'Tüm Hizmetler',
      documents: 'Kimlik ve Belgeler',
      residence: 'İkamet ve Taşınma',
      social: 'Sosyal Yardımlar',
      mobility: 'Ulaşım ve Taşıtlar',
      business: 'İşletme ve Ticaret',
      housing: 'İnşaat ve Konut',
      taxes: 'Vergiler ve Harçlar'
    }
  },
  serviceDetail: {
    notFound: 'Hizmet bulunamadı',
    notFoundSubtitle: 'İstenen hizmet bulunamadı.',
    backToServices: 'Genel bakışa dön',
    requirements: 'Gereksinimler',
    process: 'Süreç',
    fees: 'Ücretler',
    faq: 'Sık Sorulan Sorular',
    processingTime: 'İşlem süresi',
    startApplication: 'Başvuruya başla',
    readyToApply: 'Başvuruya başlamaya hazır mısınız?',
    applyNow: 'Şimdi başvur'
  },
  application: {
    title: 'Başvuru: {service}',
    personalData: 'Kişisel Bilgiler',
    documents: 'Belgeler',
    confirmation: 'Onay',
    summary: 'Özet',
    successTitle: 'Başvurunuz başarıyla gönderildi!',
    successMessage: 'Kısa süre içinde başvurunuzun durumunu takip edebileceğiniz kişisel alanınıza yönlendirileceksiniz.',
    personalInfo: {
      salutation: 'Hitap',
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfBirth: 'Doğum Tarihi',
      placeOfBirth: 'Doğum Yeri',
      nationality: 'Vatandaşlık',
      email: 'E-posta',
      phone: 'Telefon',
      address: 'Adres',
      street: 'Sokak',
      houseNumber: 'Bina No',
      postalCode: 'Posta Kodu',
      city: 'Şehir'
    },
    documentUpload: {
      title: 'Belge Yükleme',
      formats: 'Kabul edilen formatlar',
      uploadButton: 'Belge yükle',
      noDocuments: 'Hiç belge yüklenmedi.'
    },
    terms: {
      title: 'Onay',
      agreeToTerms: 'Hizmet şartlarını kabul ediyorum.',
      agreeToDataProcessing: 'Gizlilik politikası uyarınca verilerimin işlenmesini kabul ediyorum.'
    }
  },
  dashboard: {
    title: 'Hesabım',
    welcome: 'Hoş geldiniz, {name}!',
    applications: 'Başvurularım',
    notifications: 'Bildirimler',
    profile: 'Profil',
    noApplications: 'Henüz başvuru yapmadınız.',
    applicationStatus: {
      submitted: 'Gönderildi',
      inProgress: 'İşleniyor',
      awaitingDocuments: 'Belge bekleniyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      completed: 'Tamamlandı'
    }
  },
  help: {
    title: 'Yardım',
    faq: 'Sık Sorulan Sorular',
    contact: 'İletişim',
    chatbot: 'Asistanımızla sohbet edin',
    guide: 'Kullanım kılavuzu',
    askQuestion: 'Soru sor',
    searchHelp: 'Yardım konularında ara',
    contactForm: {
      name: 'İsim',
      email: 'E-posta',
      message: 'Mesaj',
      subject: 'Konu',
      send: 'Mesaj gönder'
    }
  },
  about: {
    title: 'Hakkımızda',
    mission: 'Misyonumuz',
    team: 'Ekibimiz',
    contact: 'İletişim',
    privacy: 'Gizlilik Politikası',
    terms: 'Kullanım Şartları',
    accessibility: 'Erişilebilirlik'
  },
  errors: {
    required: 'Bu alan zorunludur.',
    email: 'Lütfen geçerli bir e-posta adresi girin.',
    phone: 'Lütfen geçerli bir telefon numarası girin.',
    minLength: 'Lütfen en az {min} karakter girin.',
    maxLength: 'Lütfen en fazla {max} karakter girin.',
    fieldRequired: 'Lütfen bu alanı doldurun.',
    fileSize: 'Dosya çok büyük. Maksimum boyut: {size}MB.',
    fileFormat: 'Geçersiz dosya formatı. İzin verilen formatlar: {formats}.'
  }
}