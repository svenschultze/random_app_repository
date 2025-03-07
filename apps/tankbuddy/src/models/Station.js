/**
 * Station model representing a gas station
 */
export class Station {
  /**
   * @param {Object} data
   * @param {string} data.stationId
   * @param {string} data.name
   * @param {string} data.address
   * @param {Object} data.prices
   * @param {number} data.prices.unleaded
   * @param {number} data.prices.diesel
   * @param {number} [data.prices.premium]
   * @param {string} [data.brandLogoUrl]
   * @param {string[]} [data.amenities]
   * @param {Object} [data.hours]
   * @param {Array} [data.priceHistory]
   * @param {Object} [data.location]
   * @param {number} [data.location.latitude]
   * @param {number} [data.location.longitude]
   * @param {boolean} [data.favorite]
   * @param {number} [data.rating]
   * @param {Array} [data.reviews]
   */
  constructor(data) {
    this.stationId = data.stationId;
    this.name = data.name;
    this.address = data.address;
    this.prices = data.prices;
    this.brandLogoUrl = data.brandLogoUrl || '';
    this.amenities = data.amenities || [];
    this.hours = data.hours || {
      open: '6:00 AM',
      close: '10:00 PM'
    };
    this.priceHistory = data.priceHistory || [];
    this.location = data.location || {
      latitude: 0,
      longitude: 0
    };
    this.favorite = data.favorite || false;
    this.rating = data.rating || (Math.random() * 3 + 2).toFixed(1); // Random rating between 2-5
    this.reviews = data.reviews || [];
  }
}