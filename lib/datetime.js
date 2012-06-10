/*!
 * DateTime Helper
 * Copyright (C) 2012 Nirix
 *
 * @license GNU Lesser General Public License v3 only
 * @copyright Nirix
 * @version 1.0
 */
module.exports = DateTime = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],

  // 12 hour time, obviously...
  hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,  // 1-12
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 13-24

  /**
   * Returns the day name.
   *
   * @param integer d
   * @return string
   */
  day: function(d){
    return DateTime.days[d];
  },

  /**
   * Returns the month name.
   *
   * @param integer m
   * @return string
   */
  month: function(m){
    return DateTime.months[m];
  },

  /**
   * Returns the 12-hour time hour.
   *
   * @param integer h
   * @return integer
   */
  hour: function(h){
    return DateTime.hours[h];
  },

  /**
   * Returns the minute, if the minute is less
   * than 10, 0 is prepended to the returned value.
   *
   * @param integer m
   * @return string
   */
  minute: function(m){
    if (m < 10) { m = "0" + m; }
    return m;
  },

  /**
   * Returns either am or pm depending on the hour.
   *
   * @param integer hour
   * @return string
   */
  ampm: function(hour){
    if (hour >= 12) {
      return 'pm';
    } else {
      return 'am';
    }
  },

  /**
   * Returns st, nd, rd or th depending on the number.
   *
   * @param integer d
   * @return string
   */
  st: function(d){
    var s = ['th', 'st', 'nd', 'rd'];
    return s[(d%100>10&&d%100<20)?0:(d%10<4?d%10:0)];
  }
}