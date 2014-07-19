'use strict';

/**
 * @ngdoc overview
 * @name githubApp
 * @description
 * # githubApp
 *
 * Main module of the application.
 */
angular
  .module('githubApp', [
    'ngRoute', 
    'restangular',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'Settings'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('https://api.github.com');
    RestangularProvider.setDefaultHeaders({'Authorization': 'token d3626435e2103ca5e2ec7eaa45b777b130218b2a'});
  })
;
