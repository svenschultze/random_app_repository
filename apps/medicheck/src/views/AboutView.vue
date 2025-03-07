<template>
  <div class="about-view">
    <div class="page-header">
      <h1 v-voix="'about-title'">About MediCheck</h1>
      <p class="subtitle">Understanding our health guidance application</p>
    </div>
    
    <div class="content-container">
      <section class="about-section">
        <h2 v-voix="'about-app-heading'">About Our Application</h2>
        <p>
          MediCheck is a digital health tool designed to help users identify potential causes for their symptoms and
          provide evidence-based health guidance. Using a combination of medical knowledge databases and symptom analysis,
          MediCheck offers insights about possible conditions and appropriate next steps.
        </p>
        <p>
          Our mission is to make reliable health information more accessible to everyone while ensuring users understand
          the limitations of digital health tools.
        </p>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'how-it-works-heading'">How MediCheck Works</h2>
        <p>
          MediCheck uses a structured approach to assess your symptoms:
        </p>
        <ol>
          <li>
            <strong>Symptom Input:</strong> Users describe their symptoms through our guided interface.
          </li>
          <li>
            <strong>Data Analysis:</strong> Our system compares your symptoms against our medical knowledge base.
          </li>
          <li>
            <strong>Results Generation:</strong> Based on the analysis, MediCheck presents potential conditions and recommendations.
          </li>
          <li>
            <strong>Next Steps:</strong> Depending on the severity and nature of symptoms, the app suggests appropriate actions.
          </li>
        </ol>
        <p>
          MediCheck's recommendations are based on peer-reviewed medical literature and established clinical guidelines.
        </p>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'limitations-heading'">Limitations &amp; Important Notice</h2>
        <div class="important-notice">
          <p>
            <strong>MediCheck is not a diagnostic tool and cannot replace professional medical care.</strong>
          </p>
          <p>
            While we strive to provide accurate and helpful information, MediCheck has several important limitations:
          </p>
          <ul>
            <li>Cannot perform physical examinations or diagnostic tests</li>
            <li>May not identify rare conditions or unusual symptom presentations</li>
            <li>Does not have access to your complete medical history</li>
            <li>Cannot interpret nuanced symptoms the way a healthcare provider can</li>
          </ul>
          <p>
            <strong>If you are experiencing severe or concerning symptoms, please seek immediate medical attention.</strong>
          </p>
        </div>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'privacy-heading'">Privacy &amp; Data Security</h2>
        <p>
          MediCheck takes your privacy seriously. Our approach to data handling includes:
        </p>
        <ul>
          <li>
            <strong>Local Storage:</strong> Your personal health information is stored locally on your device.
          </li>
          <li>
            <strong>No Data Sharing:</strong> We do not sell or share your personal information with third parties.
          </li>
          <li>
            <strong>Transparent Practices:</strong> Any changes to our privacy policy will be clearly communicated.
          </li>
        </ul>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'medical-team-heading'">Our Medical Review Team</h2>
        <p>
          MediCheck's content and symptom analysis system is developed and regularly reviewed by a team of qualified healthcare professionals, including:
        </p>
        <ul>
          <li>Board-certified physicians across multiple specialties</li>
          <li>Licensed nurse practitioners with clinical experience</li>
          <li>Health informatics specialists</li>
          <li>Medical researchers with expertise in evidence-based medicine</li>
        </ul>
        <p>
          This expert oversight helps ensure our information remains accurate and aligned with current medical standards.
        </p>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'contact-heading'">Contact Information</h2>
        <p>
          If you have questions, feedback, or concerns about MediCheck, please contact us:
        </p>
        <div class="contact-info">
          <p><strong>Email:</strong> support@medicheck.example.com</p>
          <p><strong>Phone:</strong> (555) 123-4567</p>
          <p><strong>Hours:</strong> Monday-Friday, 9am-5pm EST</p>
        </div>
        <p>
          For medical emergencies, please call your local emergency services number or visit the nearest emergency room.
        </p>
      </section>
      
      <section class="about-section disclaimer-section">
        <h2 v-voix="'disclaimer-heading'">Legal Disclaimer</h2>
        <div class="disclaimer-content">
          <p>
            MediCheck is intended for informational purposes only and is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
            questions you may have regarding a medical condition.
          </p>
          <p>
            Never disregard professional medical advice or delay in seeking it because of something you have read on this 
            application. If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </p>
          <p>
            © 2025 MediCheck. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4b5563;
}

.content-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.about-section {
  margin-bottom: 2.5rem;
}

.about-section:last-child {
  margin-bottom: 0;
}

.about-section h2 {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.about-section p {
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.about-section ul,
.about-section ol {
  color: #4b5563;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.about-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.important-notice {
  background-color: #fff8f1;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 1.5rem;
}

.important-notice p:first-child {
  color: #9a3412;
  font-size: 1.1rem;
}

.important-notice ul {
  margin-bottom: 1rem;
}

.contact-info {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.disclaimer-section {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.disclaimer-section h2 {
  border-bottom: none;
  margin-bottom: 0.5rem;
}

.disclaimer-content {
  font-size: 0.875rem;
  color: #64748b;
}

.disclaimer-content p {
  margin-bottom: 0.75rem;
}

.disclaimer-content p:last-child {
  margin-bottom: 0;
  font-style: italic;
}

@media (max-width: 640px) {
  .content-container {
    padding: 1.5rem;
  }
  
  .about-section h2 {
    font-size: 1.25rem;
  }
}
</style>
