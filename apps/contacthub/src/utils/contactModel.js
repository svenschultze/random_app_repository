import { faker } from '@faker-js/faker';

/**
 * Generate a unique ID for a contact
 * @returns {string} A unique ID
 */
export function generateId() {
  return `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Generate a single random contact
 * @returns {Object} A contact object
 */
export function generateRandomContact() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    id: generateId(),
    firstName,
    lastName,
    phone: faker.phone.number(),
    email: faker.internet.email({ firstName, lastName }),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}`,
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
    tags: faker.helpers.maybe(() => {
      const possibleTags = ['Family', 'Friend', 'Work', 'School', 'Important', 'Favorite'];
      return faker.helpers.arrayElements(possibleTags, { min: 0, max: 3 });
    }, { probability: 0.6 }),
    avatarUrl: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.8 })
  };
}

/**
 * Generate multiple random contacts
 * @param {number} count Number of contacts to generate
 * @returns {Array} Array of contact objects
 */
export function generateRandomContacts(count = 30) {
  return Array.from({ length: count }, generateRandomContact);
}

/**
 * Filter contacts based on search query
 * @param {Array} contacts Array of contact objects
 * @param {string} query Search query
 * @returns {Array} Filtered array of contacts
 */
export function filterContacts(contacts, query) {
  if (!query || query.trim() === '') {
    return contacts;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  return contacts.filter(contact => {
    return (
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.phone.includes(lowerQuery) ||
      (contact.address && contact.address.toLowerCase().includes(lowerQuery)) ||
      (contact.notes && contact.notes.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Sort contacts by last name, then first name
 * @param {Array} contacts Array of contact objects
 * @returns {Array} Sorted array of contacts
 */
export function sortContacts(contacts) {
  return [...contacts].sort((a, b) => {
    const lastNameComparison = a.lastName.localeCompare(b.lastName);
    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }
    return a.firstName.localeCompare(b.firstName);
  });
}