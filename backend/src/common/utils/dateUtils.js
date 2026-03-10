// ============================================================
//  DATE UTILITIES
//  src/common/utils/dateUtils.js
// ============================================================

const moment = require("moment-timezone");

class DateUtils {
  /**
   * Format date to ISO string
   */
  static toISO(date) {
    return moment(date).toISOString();
  }

  /**
   * Format date to readable format
   */
  static format(date, format = "YYYY-MM-DD HH:mm:ss") {
    return moment(date).format(format);
  }

  /**
   * Get start of day
   */
  static startOfDay(date) {
    return moment(date).startOf("day").toDate();
  }

  /**
   * Get end of day
   */
  static endOfDay(date) {
    return moment(date).endOf("day").toDate();
  }

  /**
   * Check if date is valid
   */
  static isValid(date) {
    return moment(date).isValid();
  }

  /**
   * Add days to date
   */
  static addDays(date, days) {
    return moment(date).add(days, "days").toDate();
  }

  /**
   * Subtract days from date
   */
  static subtractDays(date, days) {
    return moment(date).subtract(days, "days").toDate();
  }

  /**
   * Get difference in days
   */
  static diffInDays(date1, date2) {
    return moment(date1).diff(moment(date2), "days");
  }

  /**
   * Get difference in hours
   */
  static diffInHours(date1, date2) {
    return moment(date1).diff(moment(date2), "hours");
  }

  /**
   * Get difference in minutes
   */
  static diffInMinutes(date1, date2) {
    return moment(date1).diff(moment(date2), "minutes");
  }

  /**
   * Check if date is in past
   */
  static isPast(date) {
    return moment(date).isBefore(moment());
  }

  /**
   * Check if date is in future
   */
  static isFuture(date) {
    return moment(date).isAfter(moment());
  }

  /**
   * Check if date is today
   */
  static isToday(date) {
    return moment(date).isSame(moment(), "day");
  }

  /**
   * Check if date is between two dates
   */
  static isBetween(date, start, end) {
    return moment(date).isBetween(start, end);
  }

  /**
   * Get age from birth date
   */
  static getAge(birthDate) {
    return moment().diff(birthDate, "years");
  }

  /**
   * Convert to timezone
   */
  static toTimezone(date, timezone) {
    return moment(date).tz(timezone).toDate();
  }

  /**
   * Get timezone offset
   */
  static getTimezoneOffset(timezone) {
    return moment.tz(timezone).utcOffset();
  }

  /**
   * Get list of timezones
   */
  static getTimezones() {
    return moment.tz.names();
  }

  /**
   * Get relative time
   */
  static relativeTime(date) {
    return moment(date).fromNow();
  }

  /**
   * Get calendar time
   */
  static calendarTime(date) {
    return moment(date).calendar();
  }

  /**
   * Check if event is upcoming
   */
  static isUpcoming(eventDate) {
    return moment(eventDate).isAfter(moment());
  }

  /**
   * Check if event is ongoing
   */
  static isOngoing(startDate, endDate) {
    const now = moment();
    return now.isBetween(startDate, endDate);
  }

  /**
   * Check if event is completed
   */
  static isCompleted(endDate) {
    return moment(endDate).isBefore(moment());
  }
}

module.exports = DateUtils;
