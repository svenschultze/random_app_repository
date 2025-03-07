import { defineStore } from 'pinia'

// Rich content generator for demo books
const generateChapterContent = (chapterNum, bookType) => {
  const chapterIntros = {
    adventure: [
      "The morning sun cast long shadows across the valley as our expedition prepared for the climb.",
      "The map led us to an ancient stone archway, half-buried in the jungle foliage.",
      "Storm clouds gathered on the horizon as we made our final preparations to cross the strait.",
      "The village elder's warnings echoed in my mind as we descended into the cavern.",
      "Daybreak found us perched on the ridge, surveying the uncharted territory that lay ahead.",
      "The compass needle spun wildly as we approached the magnetic anomaly marked on the captain's charts.",
      "Frost covered our tents when we awoke at the mountain base camp."
    ],
    mystery: [
      "The grandfather clock in the hall struck midnight, and that's when we heard the first scream.",
      "Detective Marlowe examined the strange symbol etched into the victim's door frame.",
      "The townspeople refused to discuss the abandoned manor on the hill, averting their eyes when I inquired.",
      "The package arrived unmarked, containing only an old photograph and a rusty key.",
      "Fog rolled through the empty streets as I followed the trail of muddy footprints.",
      "The librarian's expression changed when I mentioned the missing manuscript.",
      "Rain tapped against the windows like impatient fingers as we gathered in the study to hear the lawyer read the will."
    ],
    scifi: [
      "The colony ship's systems initiated wake-up protocols after three centuries of interstellar travel.",
      "Neural implants hummed softly as consciousness transfers began across the digital network.",
      "Solar sails unfurled like massive translucent wings, capturing the light of twin stars.",
      "The memory architect adjusted her equipment, preparing to extract the experiences from the subject's mind.",
      "Quantum probability calculations flashed across multiple screens, suggesting impossible outcomes.",
      "In the biodome, the last preserved specimens of Earth plant life flourished under artificial sunlight."
    ],
    fantasy: [
      "The ancient spell book glowed with an inner light when opened under the full moon.",
      "Dragon fire illuminated the night sky as the battle for the northern kingdoms began.",
      "The elven council convened beneath the branches of the World Tree to discuss the growing darkness.",
      "Runes carved into the stone circle activated as the solstice sun touched the central altar.",
      "The apprentice's first summoning went awry, bringing forth a creature unlike any described in the grimoire.",
      "Mist clung to the enchanted forest, concealing pathways that shifted and changed with the phases of the moon."
    ],
    historical: [
      "The royal decree arrived as dawn broke over the besieged city walls.",
      "Candlelight flickered across parchment as the scholar transcribed ancient manuscripts in the monastery.",
      "Revolution stirred in whispered conversations throughout the marketplace.",
      "The explorer's journal detailed encounters with civilizations previously unknown to the European powers.",
      "Treaty negotiations continued through the night as armies positioned themselves across the disputed territory.",
      "Archaeological discoveries beneath the cathedral foundations raised questions about the city's true origins."
    ],
    romance: [
      "The chance encounter at the railway station would alter the course of two lives forever.",
      "Letters exchanged over decades revealed a love story that transcended distance and circumstance.",
      "Family obligations and societal expectations stood between them like an insurmountable wall.",
      "Seasons changed, years passed, but the promise made under the old oak tree remained unbroken.",
      "Their paths crossed in the most unlikely of places, halfway around the world from where they had first met.",
      "The melody of their first dance played softly from the antique music box, stirring memories long dormant."
    ]
  };

  const paragraphTemplates = [
    "The implications were clear to everyone present. %CONCEPT% represented not just a change in circumstances, but a fundamental shift in how we understood %TOPIC%. Some argued that we should proceed with caution, while others insisted that hesitation would only lead to missed opportunities. The debate continued late into the night, with passions running high on both sides.",
    
    "Years of research had led to this moment. The evidence supporting %CONCEPT% had been meticulously gathered and analyzed, leaving little room for doubt. Yet skeptics remained, questioning the methodology and underlying assumptions. Their criticisms, though sometimes harsh, served an important purpose in refining and strengthening the core theories.",
    
    "Personal accounts varied widely, colored by individual perspectives and experiences. Those who had witnessed %TOPIC% firsthand spoke with a certainty that was compelling, yet subjective. Attempts to reconcile these narratives with documented facts presented challenges that required both analytical rigor and empathetic understanding.",
    
    "Historical context proved essential to fully appreciating the significance of %CONCEPT%. Previous attempts to address similar situations had yielded valuable lessons, though circumstances had changed considerably in the intervening time. Drawing appropriate parallels while acknowledging important differences became a crucial aspect of the discourse.",
    
    "Ethical considerations surrounded every aspect of %TOPIC%. The potential benefits were substantial, but so too were the risks of unintended consequences. Establishing a framework for responsible decision-making became a priority, with particular attention paid to impacts on the most vulnerable populations.",
    
    "Technological advancements had accelerated the pace of change, introducing new variables into an already complex equation. Adapting to these developments required flexibility and foresight, qualities not always abundant in traditional institutions. Innovative approaches emerged from unexpected sources, challenging conventional wisdom about %CONCEPT%.",
    
    "Cultural differences influenced how communities responded to %TOPIC%. Practices that seemed foreign or even controversial from one perspective often had deep historical roots and internal logic when viewed in their proper context. Finding common ground amid this diversity became both a challenge and an opportunity for growth.",
    
    "Economic factors inevitably entered the conversation, raising questions about resources, incentives, and sustainable models. Short-term considerations sometimes conflicted with long-term goals, creating tension between immediate needs and future aspirations. Balancing these competing priorities required nuanced understanding of both market forces and human necessities.",
    
    "The environmental dimensions of %CONCEPT% could not be overlooked. Interconnected systems meant that actions in one area often had ripple effects throughout the broader ecosystem. Holistic approaches gained favor as the limitations of narrowly focused solutions became increasingly apparent.",
    
    "Future generations would ultimately inherit the consequences of current decisions regarding %TOPIC%. This awareness brought a sense of responsibility that transcended immediate concerns, encouraging a longer view and more thoughtful deliberation. What legacy would be left, and how would it be judged by those who came after?"
  ];

  const concepts = {
    adventure: ["the expedition", "our discovery", "the ancient map", "the indigenous knowledge", "the uncharted territory"],
    mystery: ["the disappearance", "the cryptic message", "the witness testimony", "the hidden chamber", "the family secret"],
    scifi: ["neural integration", "the quantum breakthrough", "interspecies communication", "temporal displacement", "synthetic consciousness"],
    fantasy: ["the prophecy", "magical convergence", "elemental binding", "the ancient pact", "spiritual awakening"],
    historical: ["the royal succession", "the diplomatic alliance", "the military strategy", "cultural exchange", "technological innovation"],
    romance: ["their reunion", "the unspoken promise", "societal expectations", "emotional vulnerability", "personal sacrifice"]
  };

  const topics = {
    adventure: ["exploration", "risk", "cultural preservation", "natural phenomena", "human endurance"],
    mystery: ["truth", "deception", "justice", "perception", "hidden motivations"],
    scifi: ["humanity", "technological ethics", "cosmic principles", "evolutionary paths", "artificial intelligence"],
    fantasy: ["power", "destiny", "balance", "ancient wisdom", "transformation"],
    historical: ["governance", "social change", "conflict resolution", "intellectual tradition", "artistic expression"],
    romance: ["commitment", "personal growth", "family dynamics", "second chances", "self-discovery"]
  };

  // Select appropriate content based on book type
  const intros = chapterIntros[bookType] || chapterIntros.adventure;
  const bookConcepts = concepts[bookType] || concepts.adventure;
  const bookTopics = topics[bookType] || topics.adventure;

  // Build chapter content
  const chapterTitle = `Chapter ${chapterNum}`;
  const chapterIntro = intros[chapterNum % intros.length];
  
  // Generate 3-5 paragraphs with substituted concepts and topics
  let chapterBody = "";
  const paragraphCount = 3 + Math.floor(Math.random() * 3); // 3-5 paragraphs
  
  for (let i = 0; i < paragraphCount; i++) {
    const template = paragraphTemplates[Math.floor(Math.random() * paragraphTemplates.length)];
    const concept = bookConcepts[Math.floor(Math.random() * bookConcepts.length)];
    const topic = bookTopics[Math.floor(Math.random() * bookTopics.length)];
    
    const paragraph = template
      .replace('%CONCEPT%', concept)
      .replace('%TOPIC%', topic);
    
    chapterBody += paragraph + "\n\n";
  }
  
  return `${chapterTitle}\n\n${chapterIntro}\n\n${chapterBody}`;
};

// Generate more realistic book covers
const bookCovers = [
  // Adventure books
  {
    gradient: 'linear-gradient(135deg, #FF9966, #FF5E62)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
  },
  {
    gradient: 'linear-gradient(135deg, #3a7bd5, #00d2ff)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  },
  // Mystery books
  {
    gradient: 'linear-gradient(135deg, #232526, #414345)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'
  },
  {
    gradient: 'linear-gradient(135deg, #4b6cb7, #182848)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")'
  },
  // Sci-fi books
  {
    gradient: 'linear-gradient(135deg, #4776E6, #8E54E9)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.414 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.657 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413L30 11.8l7.07 7.414zm-2.827 2.83l1.414-1.416L30 15.17l-5.657 5.656 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 21.03l-2.828 2.828 1.414 1.414L30 23.857l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z\' fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
  },
  {
    gradient: 'linear-gradient(135deg, #000428, #004e92)',
    pattern: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'40\' viewBox=\'0 0 50 40\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M40 10L36.67 0h-2.11l3.33 10H20l-2.28 6.84L12.11 0H10l6.7 20H10l-2.28 6.84L2.11 10 5.44 0h-2.1L0 10l6.7 20-3.34 10h2.11l2.28-6.84L10 40h20l2.28-6.84L34.56 40h2.1l-3.33-10H40l2.28-6.84L47.89 40H50l-6.7-20L50 0h-2.1l-5.62 16.84L40 10zm1.23 10l-2.28-6.84L34 28h4.56l2.67-8zm-10.67 8l-2-6h-9.12l2 6h9.12zm-12.84-4.84L12.77 38h15.79l2.67-8H17.7l2.28-6.84zM10 30l2.4-7.2L12.11 20H5.44L3.89 24l2.67 8H10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  },
  // Historical books
  {
    gradient: 'linear-gradient(135deg, #a73737, #7a2828)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'180\' height=\'180\' viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414L70 87.586 90.414 108l.586.586L91.586 108l.293.293 16.413-16.413.707-.707.707.707 16.293 16.293-.293.293 1 1 .293.293-16.413 16.413-.707.707-.707-.707L90.414 109l-.286-.286-.707.707-16.414 16.414-.707.707-.707-.707L55.414 109l7.293-7.293L66.414 98h17.172L90 104.414 96.414 98h17.172l2.707 2.707 7.293 7.293L117.414 109 100.293 91.293l-.707.707-2.293 2.293-.293-.293L90.293 87.293l-16-16-.293.293-2.293-2.293-.707.707L68.414 72h13.172l.707.707 7.293 7.293z\' fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
  },
  {
    gradient: 'linear-gradient(135deg, #603813, #b29f94)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'42\' height=\'44\' viewBox=\'0 0 42 44\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  },
  // Fantasy books
  {
    gradient: 'linear-gradient(135deg, #654ea3, #eaafc8)',
    pattern: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'88\' height=\'24\' viewBox=\'0 0 88 24\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M13 0h1v8H0V0h1zm0 0v8h7.981V0H13zm-1 0H5.019v8H12V0zM2 0v8h2V0H2zm-1 0v8h1V0H1zM1 9v8h1V9H1zm1 0v8h2V9H2zm3 0h7.981v8H5V9zm8.981 0H21v8h-7.019V9zM22 9v8h1V9h-1zm-1 0v8h7.981V9H21zM44 9v8h1V9h-1zm-1 0v8h7.981V9H43zM23 0h1v8h-1V0zm0 9h1v8h-1V9zm23 0h1v8h-1V9zm0-9h1v8h-1V0zm1 8h7.981V0H47v8zm1-7v6h6V1h-6zm0-1h7v8h-7V0zm22 1v6h6V1h-6zm0-1h7v8h-7V0zm-1 8h7.981V0H68v8zM67 9h1v8h-1V9zm1 0v8h7.981V9H68zm22-9v8h1V0h-1zm-1 0v8h7.981V0H89zM89 9v8h1V9h-1zm-1 0v8h7.981V9H88zm-66 9v6h6v-6h-6zm-1-1h8v8h-8v-8zm22 1v6h6v-6h-6zm0-1h8v8h-8v-8zm22 1v6h6v-6h-6zm0-1h8v8h-8v-8zm22 1v6h6v-6h-6zm0-1h8v8h-8v-8zm-44 15v6h6v-6h-6zm0-1h8v8h-8v-8zm0-15v6h6v-6h-6zm0-1h8v8h-8v-8zm-22 1v6h6v-6h-6zm0-1h8v8h-8v-8zm44 1v6h6v-6h-6zm0-1h8v8h-8v-8zm66 15h1.981v8H88v-8zm-1 8h-7.019v-8H87v8zm-7.019-8H72v8h7.981v-8zM45 23v-8h-1v8h1zm-1 0v-8h-7.981v8H44zm-7.981-8H28v8h8.019v-8zM28 15v8h-1v-8h1zm-1 8v-8h-7.981v8H27zm-9-8v8h-1v-8h1zm-1 8v-8h-7.981v8H17zm-9-8v8h-1v-8h1zm-1 8v-8H5.019v8H7zm-2.019 0H0v-8h4.981v8z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  },
  {
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'64\' height=\'64\' viewBox=\'0 0 64 64\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z\' fill=\'%23ffffff\' fill-opacity=\'0.12\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
  },
  // Romance books
  {
    gradient: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'44\' height=\'12\' viewBox=\'0 0 22 12\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M2 2c.5-.5 1.5-.5 2 0 .5.5.5 1.5 0 2-.5.5-1.5.5-2 0-.5-.5-.5-1.5 0-2zm18 0c.5-.5 1.5-.5 2 0 .5.5.5 1.5 0 2-.5.5-1.5.5-2 0-.5-.5-.5-1.5 0-2zm-12 6c.5-.5 1.5-.5 2 0 .5.5.5 1.5 0 2-.5.5-1.5.5-2 0-.5-.5-.5-1.5 0-2zm18 0c.5-.5 1.5-.5 2 0 .5.5.5 1.5 0 2-.5.5-1.5.5-2 0-.5-.5-.5-1.5 0-2zm-6-6c.5-.5 1.5-.5 2 0 .5.5.5 1.5 0 2-.5.5-1.5.5-2 0-.5-.5-.5-1.5 0-2zm-12 6c.5-.5 1.5-.5 2 0 .5.5.5 1.5 0 2-.5.5-1.5.5-2 0-.5-.5-.5-1.5 0-2z\' fill=\'%23ffffff\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
  },
  {
    gradient: 'linear-gradient(135deg, #c94b4b, #4b134f)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
  }
];

// Mock data for books with rich content
const sampleBooks = [
  {
    id: 'book1',
    title: 'The Ancient Explorer\'s Map',
    author: 'Amelia Blackwood',
    description: 'A thrilling adventure across uncharted territories as archaeologist Dr. James Reeves follows a mysterious ancient map that promises to reveal the location of a forgotten civilization.',
    coverStyle: bookCovers[0],
    type: 'adventure',
    content: Array(12).fill(null).map((_, i) => generateChapterContent(i, 'adventure')),
    tags: ['adventure', 'archaeology', 'exploration', 'ancient civilization']
  },
  {
    id: 'book2',
    title: 'Whispers in the Shadows',
    author: 'Sebastian Crane',
    description: 'When a series of inexplicable disappearances haunts a small coastal town, detective Olivia Parker must confront her own troubled past while unraveling the dark secrets that connect the missing persons.',
    coverStyle: bookCovers[2],
    type: 'mystery',
    content: Array(10).fill(null).map((_, i) => generateChapterContent(i, 'mystery')),
    tags: ['mystery', 'detective', 'small town', 'suspense']
  },
  {
    id: 'book3',
    title: 'Stellar Convergence',
    author: 'Nova Chen',
    description: 'Three hundred years after Earth\'s collapse, the scattered colonies of humanity face a new threat that challenges the very definition of consciousness and existence.',
    coverStyle: bookCovers[4],
    type: 'scifi',
    content: Array(9).fill(null).map((_, i) => generateChapterContent(i, 'scifi')),
    tags: ['science fiction', 'space', 'artificial intelligence', 'posthuman']
  },
  {
    id: 'book4',
    title: 'The Alchemy of Shadows',
    author: 'Elara Nightshade',
    description: 'In a world where magic flows through ancient ley lines, a young apprentice discovers a forbidden spell book that could either restore balance to the realms or unleash catastrophic power.',
    coverStyle: bookCovers[8],
    type: 'fantasy',
    content: Array(11).fill(null).map((_, i) => generateChapterContent(i, 'fantasy')),
    tags: ['fantasy', 'magic', 'adventure', 'coming of age']
  },
  {
    id: 'book5',
    title: 'Letters from the Revolution',
    author: 'Theodore Hamilton',
    description: 'Through a collection of letters between a soldier and his beloved, witness the American Revolution unfold with all its idealism, sacrifice, and contradictions.',
    coverStyle: bookCovers[6],
    type: 'historical',
    content: Array(8).fill(null).map((_, i) => generateChapterContent(i, 'historical')),
    tags: ['historical fiction', 'revolution', 'romance', '18th century']
  },
  {
    id: 'book6',
    title: 'Autumn in Paris',
    author: 'Claire Beaumont',
    description: 'When artist Sophie travels to Paris to escape heartbreak, she doesn\'t expect to find love again with the charming but mysterious café owner who harbors secrets of his own.',
    coverStyle: bookCovers[10],
    type: 'romance',
    content: Array(10).fill(null).map((_, i) => generateChapterContent(i, 'romance')),
    tags: ['romance', 'paris', 'second chances', 'contemporary']
  },
  {
    id: 'book7',
    title: 'The Quantum Detective',
    author: 'Isaac Morgan',
    description: 'In 2150, detective Eliot Chen investigates impossible crimes using quantum technology that allows him to observe alternate realities until he discovers a murder that exists in every possible timeline.',
    coverStyle: bookCovers[5],
    type: 'scifi',
    content: Array(9).fill(null).map((_, i) => generateChapterContent(i, 'scifi')),
    tags: ['science fiction', 'detective', 'quantum physics', 'future tech']
  },
  {
    id: 'book8',
    title: 'The Forgotten Crown',
    author: 'Alaric Stormwind',
    description: 'A legendary crown with the power to unite the fractured kingdoms is rediscovered, triggering a perilous quest as noble houses, ancient orders, and dark forces vie for its control.',
    coverStyle: bookCovers[9],
    type: 'fantasy',
    content: Array(12).fill(null).map((_, i) => generateChapterContent(i, 'fantasy')),
    tags: ['fantasy', 'epic', 'politics', 'magic']
  }
];

// Rich user data with avatars and reading preferences
const mockUsers = [
  { 
    id: 'user1', 
    name: 'Alice Chen', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice&backgroundColor=b6e3f4',
    preferences: ['science fiction', 'mystery', 'historical fiction'],
    bookProgress: {
      'book1': 3,
      'book3': 5,
      'book7': 2
    }
  },
  { 
    id: 'user2', 
    name: 'Marcus Jones', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus&backgroundColor=d1d4f9',
    preferences: ['fantasy', 'adventure', 'science fiction'],
    bookProgress: {
      'book4': 6,
      'book8': 4,
      'book3': 3
    }
  },
  { 
    id: 'user3', 
    name: 'Sofia Rodriguez', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia&backgroundColor=c0aede',
    preferences: ['romance', 'mystery', 'historical fiction'],
    bookProgress: {
      'book2': 8,
      'book5': 5,
      'book6': 7
    }
  },
  { 
    id: 'user4', 
    name: 'Jayden Williams', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jayden&backgroundColor=ffdfbf',
    preferences: ['adventure', 'science fiction', 'fantasy'],
    bookProgress: {
      'book1': 9,
      'book7': 3,
      'book8': 2
    }
  },
  { 
    id: 'user5', 
    name: 'Emma Clarke', 
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma&backgroundColor=ffd6cc',
    preferences: ['historical fiction', 'mystery', 'romance'],
    bookProgress: {
      'book5': 7,
      'book2': 6,
      'book6': 4
    }
  }
];

// Mock current user with richer profile
const currentUser = {
  id: 'user1',
  name: 'Alice Chen',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice&backgroundColor=b6e3f4',
  email: 'alice.chen@example.com',
  joinDate: '2023-09-15T10:30:00.000Z',
  preferences: ['science fiction', 'mystery', 'historical fiction'],
  bookProgress: {
    'book1': 3,
    'book3': 5,
    'book7': 2
  },
  badges: [
    { id: 'early-adopter', title: 'Early Adopter', icon: '🚀', description: 'Among the first to join BookShare' },
    { id: 'avid-reader', title: 'Avid Reader', icon: '📚', description: 'Read 5+ books' },
    { id: 'commentator', title: 'Thoughtful Commentator', icon: '💬', description: 'Left 20+ comments' }
  ]
};

// Sample annotations with rich content and structures
const sampleAnnotations = [
  // Book 1 annotations
  {
    id: 'note1',
    bookId: 'book1',
    page: 2,
    type: 'highlight',
    text: 'The expedition would venture far beyond the known maps, into territories where even the most hardened explorers refused to go.',
    color: '#FFEB3B',
    position: { start: 120, end: 240 },
    userId: 'user1',
    userName: 'Alice Chen',
    userAvatar: mockUsers.find(u => u.id === 'user1')?.avatar,
    createdAt: '2024-01-10T14:25:33.000Z',
    replies: [
      {
        id: 'reply1-1',
        text: 'This reminds me of the historical Amazon expeditions in the early 20th century.',
        userId: 'user4',
        userName: 'Jayden Williams',
        userAvatar: mockUsers.find(u => u.id === 'user4')?.avatar,
        createdAt: '2024-01-10T16:12:45.000Z'
      },
      {
        id: 'reply1-2',
        text: 'The author does such a great job building tension in this paragraph!',
        userId: 'user2',
        userName: 'Marcus Jones',
        userAvatar: mockUsers.find(u => u.id === 'user2')?.avatar,
        createdAt: '2024-01-11T09:32:18.000Z'
      }
    ]
  },
  {
    id: 'note2',
    bookId: 'book1',
    page: 4,
    type: 'comment',
    text: 'The village elder\'s warnings echoed in my mind as we descended into the cavern.',
    context: 'The village elder\'s warnings echoed in my mind as we descended into the cavern.',
    position: { start: 0, end: 72 },
    comment: 'Classic foreshadowing! I\'m predicting this will be important later in the story.',
    userId: 'user3',
    userName: 'Sofia Rodriguez',
    userAvatar: mockUsers.find(u => u.id === 'user3')?.avatar,
    createdAt: '2024-01-12T18:05:12.000Z',
    replies: [
      {
        id: 'reply2-1',
        text: 'Good catch! The author is definitely setting something up here.',
        userId: 'user1',
        userName: 'Alice Chen',
        userAvatar: mockUsers.find(u => u.id === 'user1')?.avatar,
        createdAt: '2024-01-12T19:23:05.000Z'
      }
    ]
  },
  
  // Book 3 annotations
  {
    id: 'note3',
    bookId: 'book3',
    page: 1,
    type: 'highlight',
    text: 'The colony ship\'s systems initiated wake-up protocols after three centuries of interstellar travel.',
    color: '#4CAF50',
    position: { start: 0, end: 86 },
    userId: 'user2',
    userName: 'Marcus Jones',
    userAvatar: mockUsers.find(u => u.id === 'user2')?.avatar,
    createdAt: '2024-02-03T11:15:42.000Z',
    replies: [
      {
        id: 'reply3-1',
        text: 'What a powerful opening line! Immediately sets the scope of the story.',
        userId: 'user1',
        userName: 'Alice Chen',
        userAvatar: mockUsers.find(u => u.id === 'user1')?.avatar,
        createdAt: '2024-02-03T12:43:21.000Z'
      },
      {
        id: 'reply3-2',
        text: 'I wonder if anyone is still alive after such a long journey...',
        userId: 'user4',
        userName: 'Jayden Williams',
        userAvatar: mockUsers.find(u => u.id === 'user4')?.avatar,
        createdAt: '2024-02-04T10:17:09.000Z'
      },
      {
        id: 'reply3-3',
        text: 'The concept of generational ships always fascinates me. Are they in cryosleep or have generations lived and died onboard?',
        userId: 'user1',
        userName: 'Alice Chen',
        userAvatar: mockUsers.find(u => u.id === 'user1')?.avatar,
        createdAt: '2024-02-04T14:58:33.000Z'
      }
    ]
  },
  {
    id: 'note4',
    bookId: 'book3',
    page: 3,
    type: 'comment',
    text: 'Neural implants hummed softly as consciousness transfers began across the digital network.',
    context: 'Neural implants hummed softly as consciousness transfers began across the digital network.',
    position: { start: 0, end: 86 },
    comment: 'The technological concepts in this book are so well researched. This particular idea of consciousness transfer has been explored in real AI research papers.',
    userId: 'user1',
    userName: 'Alice Chen',
    userAvatar: mockUsers.find(u => u.id === 'user1')?.avatar,
    createdAt: '2024-02-05T20:11:37.000Z',
    replies: [
      {
        id: 'reply4-1',
        text: 'Completely agree. The author must have a background in neuroscience or AI research.',
        userId: 'user4',
        userName: 'Jayden Williams',
        userAvatar: mockUsers.find(u => u.id === 'user4')?.avatar,
        createdAt: '2024-02-06T08:42:15.000Z'
      },
      {
        id: 'reply4-2',
        text: 'Have you read any articles about this? Would love some recommendations.',
        userId: 'user2',
        userName: 'Marcus Jones',
        userAvatar: mockUsers.find(u => u.id === 'user2')?.avatar,
        createdAt: '2024-02-06T14:05:28.000Z'
      }
    ]
  },
  
  // Book 2 annotations
  {
    id: 'note5',
    bookId: 'book2',
    page: 0,
    type: 'highlight',
    text: 'The grandfather clock in the hall struck midnight, and that\'s when we heard the first scream.',
    color: '#2196F3',
    position: { start: 0, end: 86 },
    userId: 'user5',
    userName: 'Emma Clarke',
    userAvatar: mockUsers.find(u => u.id === 'user5')?.avatar,
    createdAt: '2024-01-20T22:08:14.000Z',
    replies: [
      {
        id: 'reply5-1',
        text: 'I got chills reading this opening line. Perfect for a mystery novel!',
        userId: 'user3',
        userName: 'Sofia Rodriguez',
        userAvatar: mockUsers.find(u => u.id === 'user3')?.avatar,
        createdAt: '2024-01-21T00:37:29.000Z'
      }
    ]
  },
  {
    id: 'note6',
    bookId: 'book2',
    page: 5,
    type: 'comment',
    text: 'Fog rolled through the empty streets as I followed the trail of muddy footprints.',
    context: 'Fog rolled through the empty streets as I followed the trail of muddy footprints.',
    position: { start: 0, end: 78 },
    comment: 'The atmosphere is so thick in this scene, you can practically feel the dampness and chill. Brilliant sensory writing!',
    userId: 'user3',
    userName: 'Sofia Rodriguez',
    userAvatar: mockUsers.find(u => u.id === 'user3')?.avatar,
    createdAt: '2024-01-22T13:27:56.000Z',
    replies: [
      {
        id: 'reply6-1',
        text: 'Reminds me of classic noir detective fiction. The author definitely draws from that tradition.',
        userId: 'user5',
        userName: 'Emma Clarke',
        userAvatar: mockUsers.find(u => u.id === 'user5')?.avatar,
        createdAt: '2024-01-23T16:15:42.000Z'
      },
      {
        id: 'reply6-2',
        text: 'Do you think it\'s set in London? The fog and general atmosphere makes me think of Victorian London.',
        userId: 'user1',
        userName: 'Alice Chen',
        userAvatar: mockUsers.find(u => u.id === 'user1')?.avatar,
        createdAt: '2024-01-23T18:03:11.000Z'
      },
      {
        id: 'reply6-3',
        text: 'I think it\'s intentionally vague about the exact setting, which adds to the mysterious feel.',
        userId: 'user3',
        userName: 'Sofia Rodriguez',
        userAvatar: mockUsers.find(u => u.id === 'user3')?.avatar,
        createdAt: '2024-01-24T09:44:28.000Z'
      }
    ]
  }
];

export const useBookStore = defineStore('books', {
  state: () => ({
    books: sampleBooks,
    currentBook: null,
    currentPage: 0,
    annotations: sampleAnnotations,
    currentUser: currentUser,
    mockUsers: mockUsers,
    filters: {
      genre: null,
      searchTerm: ''
    }
  }),
  
  getters: {
    getBookById: (state) => (id) => {
      return state.books.find(book => book.id === id)
    },
    
    getCurrentBookContent: (state) => {
      if (!state.currentBook) return []
      return state.currentBook.content[state.currentPage]
    },
    
    getAnnotationsForCurrentPage: (state) => {
      if (!state.currentBook) return []
      return state.annotations.filter(
        annotation => annotation.bookId === state.currentBook.id && 
                     annotation.page === state.currentPage
      )
    },
    
    totalPages: (state) => {
      if (!state.currentBook) return 0
      return state.currentBook.content.length
    }
  },
  
  actions: {
    selectBook(bookId) {
      const book = this.getBookById(bookId)
      if (book) {
        this.currentBook = book
        this.currentPage = 0
      }
    },
    
    nextPage() {
      if (this.currentBook && this.currentPage < this.totalPages - 1) {
        this.currentPage++
      }
    },
    
    previousPage() {
      if (this.currentBook && this.currentPage > 0) {
        this.currentPage--
      }
    },
    
    goToPage(pageNumber) {
      if (this.currentBook && pageNumber >= 0 && pageNumber < this.totalPages) {
        this.currentPage = pageNumber
      }
    },
    
    addAnnotation(annotation) {
      // Generate a unique ID
      const id = `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Add metadata to the annotation
      const newAnnotation = {
        id,
        createdAt: new Date().toISOString(),
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        bookId: this.currentBook.id,
        page: this.currentPage,
        ...annotation
      }
      
      this.annotations.push(newAnnotation)
      return newAnnotation
    },
    
    updateAnnotation(id, updates) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index !== -1) {
        this.annotations[index] = { ...this.annotations[index], ...updates }
      }
    },
    
    deleteAnnotation(id) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index !== -1) {
        this.annotations.splice(index, 1)
      }
    },
    
    addReply(annotationId, text) {
      const annotation = this.annotations.find(a => a.id === annotationId)
      if (!annotation) return
      
      if (!annotation.replies) {
        annotation.replies = []
      }
      
      // Choose a random user other than the current one
      const otherUsers = this.mockUsers.filter(user => user.id !== this.currentUser.id)
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)]
      
      annotation.replies.push({
        id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        userId: randomUser.id,
        userName: randomUser.name,
        createdAt: new Date().toISOString()
      })
    }
  }
})