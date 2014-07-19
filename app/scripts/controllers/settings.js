'use strict';

/**
 * @ngdoc function
 * @name githubApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the githubApp
 */
angular.module('githubApp')
  .controller('SettingsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
