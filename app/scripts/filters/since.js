'use strict';

/**
 * @ngdoc filter
 * @name githubApp.filter:since
 * @function
 * @description
 * # since
 * Get the time ellapsed from the given date.
 * @example "9 days", "1 minute", ...
 */
angular.module('githubApp')
  .filter('since', function () {
    return function (createdAt) {
      var creationDate = new Date(createdAt);
      var nowDate = new Date();

      var diffMs = nowDate - creationDate;
      var diffSec = Math.round(diffMs/1000);
      var diffMin = Math.round(diffSec/60); if (diffMin === 0) { return diffSec + ' seconde' + ((diffSec > 1) ? 's' : ''); }
      var diffHrs = Math.round(diffMin/60); if (diffHrs === 0) { return diffMin + ' minute' + ((diffMin > 1) ? 's' : ''); }
      var diffDay = Math.round(diffHrs/24); if (diffDay === 0) { return diffHrs + ' hour' + ((diffHrs > 1) ? 's' : ''); }
      var diffMth = Math.round(diffDay/30); if (diffMth === 0) { return diffDay + ' day' + ((diffDay > 1) ? 's' : ''); }

      return diffMth + ' month' + ((diffMth > 1) ? 's' : '');
    };
  });
