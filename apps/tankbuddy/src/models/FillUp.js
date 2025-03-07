/**
 * FillUp model representing a fuel fill-up record
 */
export class FillUp {
  /**
   * @param {Object} data
   * @param {string} data.entryId
   * @param {string} data.date
   * @param {number} data.odometer
   * @param {number} data.volume
   * @param {number} data.pricePerLiter
   * @param {number} [data.totalCost]
   * @param {string} [data.stationId]
   * @param {string} [data.notes]
   */
  constructor(data) {
    this.entryId = data.entryId;
    this.date = data.date;
    this.odometer = data.odometer;
    this.volume = data.volume;
    this.pricePerLiter = data.pricePerLiter;
    this.totalCost = data.totalCost || this.volume * this.pricePerLiter;
    this.stationId = data.stationId || '';
    this.notes = data.notes || '';
  }
}