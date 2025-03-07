// Utility functions to generate random insurance data

// Generate a random date within a range of years before current date
function randomDate(yearsBack = 1) {
  const today = new Date();
  const earliestDate = new Date(today);
  earliestDate.setFullYear(today.getFullYear() - yearsBack);
  
  const randomTimestamp = earliestDate.getTime() + Math.random() * (today.getTime() - earliestDate.getTime());
  return new Date(randomTimestamp);
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate a random policy ID
function generatePolicyId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let id = 'POL-';
  
  // Add 2 random letters
  for (let i = 0; i < 2; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return id;
}

// Generate a random claim ID
function generateClaimId() {
  return `CLM-${Math.floor(Math.random() * 900 + 100)}`;
}

// Generate random amount within range
function randomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate random coverage category
function randomCoverageCategory() {
  const categories = [
    {
      category: 'Outpatient',
      coverageLimit: randomAmount(1000, 5000),
      deductible: randomAmount(50, 200),
      coPayPercent: randomAmount(10, 20),
      waitingPeriod: 0,
      maxVisitsPerYear: randomAmount(10, 30)
    },
    {
      category: 'Inpatient',
      coverageLimit: randomAmount(10000, 50000),
      deductible: randomAmount(200, 500),
      coPayPercent: randomAmount(5, 15),
      waitingPeriod: 0,
      maxVisitsPerYear: null
    },
    {
      category: 'Dental',
      coverageLimit: randomAmount(800, 2000),
      deductible: randomAmount(50, 150),
      coPayPercent: randomAmount(15, 30),
      waitingPeriod: randomAmount(0, 3),
      maxVisitsPerYear: randomAmount(2, 4)
    },
    {
      category: 'Vision',
      coverageLimit: randomAmount(500, 1500),
      deductible: randomAmount(25, 100),
      coPayPercent: randomAmount(10, 20),
      waitingPeriod: randomAmount(0, 3),
      maxVisitsPerYear: randomAmount(1, 2)
    },
    {
      category: 'Pharmacy',
      coverageLimit: randomAmount(2000, 5000),
      deductible: randomAmount(25, 75),
      coPayPercent: randomAmount(10, 30),
      waitingPeriod: 0,
      maxVisitsPerYear: null
    },
    {
      category: 'Maternity',
      coverageLimit: randomAmount(5000, 15000),
      deductible: randomAmount(250, 500),
      coPayPercent: randomAmount(10, 20),
      waitingPeriod: randomAmount(6, 12),
      maxVisitsPerYear: null
    },
    {
      category: 'Mental Health',
      coverageLimit: randomAmount(2000, 8000),
      deductible: randomAmount(100, 300),
      coPayPercent: randomAmount(10, 25),
      waitingPeriod: randomAmount(0, 2),
      maxVisitsPerYear: randomAmount(10, 20)
    },
    {
      category: 'Emergency',
      coverageLimit: randomAmount(10000, 30000),
      deductible: randomAmount(100, 400),
      coPayPercent: randomAmount(5, 15),
      waitingPeriod: 0,
      maxVisitsPerYear: null
    }
  ];
  
  return categories[Math.floor(Math.random() * categories.length)];
}

// Generate a complete set of coverage plans
function generateCoveragePlans() {
  // Get all available categories once to avoid duplicates
  const coveragePlans = [];
  const categoryNames = [
    'Outpatient', 'Inpatient', 'Dental', 'Vision', 
    'Pharmacy', 'Maternity', 'Mental Health', 'Emergency'
  ];
  
  // Randomly select 5-8 categories for this policy
  const numCategories = randomAmount(5, 8);
  const shuffledCategories = [...categoryNames].sort(() => 0.5 - Math.random());
  const selectedCategories = shuffledCategories.slice(0, numCategories);
  
  selectedCategories.forEach(categoryName => {
    const categoryData = randomCoverageCategory();
    // Find the template for this category
    if (categoryData.category === categoryName) {
      coveragePlans.push(categoryData);
    }
  });
  
  return coveragePlans;
}

// List of common medical procedures for claims
const medicalProcedures = [
  'Routine check-up',
  'Blood test',
  'X-ray examination',
  'Annual physical',
  'Dental cleaning',
  'Tooth extraction',
  'Eye examination',
  'Prescription refill',
  'Vaccination',
  'Specialist consultation',
  'Emergency room visit',
  'Physiotherapy session',
  'Mental health counseling',
  'Pregnancy check-up',
  'Surgery consultation',
  'MRI scan',
  'CT scan',
  'Ultrasound'
];

// Generate a random claim
function generateClaim(coveragePlans, startDate) {
  const statusOptions = ['Pending', 'Approved', 'Rejected', 'In Review'];
  const randomCategory = coveragePlans[Math.floor(Math.random() * coveragePlans.length)];
  
  // Calculate date range - between policy start date and today
  const today = new Date();
  const claimDate = new Date(startDate);
  claimDate.setDate(claimDate.getDate() + randomAmount(1, (today - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  
  // Calculate a reasonable amount based on the category
  const maxAmount = randomCategory.coverageLimit * 0.3; // Max claim is 30% of coverage limit
  const minAmount = 50;
  
  return {
    claimId: generateClaimId(),
    dateOfService: formatDate(claimDate),
    category: randomCategory.category,
    amount: randomAmount(minAmount, maxAmount),
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    description: medicalProcedures[Math.floor(Math.random() * medicalProcedures.length)],
    createdDate: formatDate(new Date(claimDate.getTime() + randomAmount(1, 14) * 24 * 60 * 60 * 1000))
  };
}

// Generate a complete policy with random coverage and claims
export function generateRandomPolicy() {
  const startDate = formatDate(randomDate(2));
  const policyId = generatePolicyId();
  const coveragePlans = generateCoveragePlans();
  
  // Generate between 5-10 random claims
  const claims = [];
  const numClaims = randomAmount(5, 10);
  
  for (let i = 0; i < numClaims; i++) {
    claims.push(generateClaim(coveragePlans, startDate));
  }
  
  // Sort claims by date (newest first)
  claims.sort((a, b) => new Date(b.dateOfService) - new Date(a.dateOfService));
  
  return {
    policyId,
    userName: 'Max Mustermann',
    startDate,
    coveragePlans,
    claims,
    membershipLevel: ['Basic', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)],
    nextPaymentDate: formatDate(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)),
    premiumAmount: randomAmount(50, 300)
  };
}

// Create a new claim for an existing policy
export function createNewClaim(policy, claimData) {
  const newClaim = {
    claimId: generateClaimId(),
    dateOfService: claimData.dateOfService,
    category: claimData.category,
    amount: claimData.amount,
    status: 'Pending',
    description: claimData.description,
    createdDate: formatDate(new Date())
  };
  
  return newClaim;
}