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
    'LocalStorageModule',
    'mm.foundation'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'Projects'
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
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if (operation === 'getList' && what === 'pulls') {
        for (var i = 0 ; i < data.length ; i++) {
          data[i]['branch'] = data[i].head;
        }
      }

      return data;
    });
  })
;
