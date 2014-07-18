'use strict';

/**
 * @ngdoc function
 * @name githubApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the githubApp
 */
angular.module('githubApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
