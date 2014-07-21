'use strict';

/**
 * @ngdoc overview
 * @name githubApp
 * @description
 * # githubApp
 *
 * Main module of the application.
 */
var app = angular
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
    //1328c5eabfda988998a9191fedd7707db5d4cdb6
    //RestangularProvider.setDefaultHeaders({'Authorization': 'token d3626435e2103ca5e2ec7eaa45b777b130218b2a'});
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if (operation === 'getList' && what === 'pulls') {
        for (var i = 0 ; i < data.length ; i++) {
          data[i]['branch'] = data[i].head;
        }
      }

      return data;
    });
  })
  .config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(function(localStorageService) {
      var externalRequestMatcher = /^https?/;

      return {
        request: function(config) {
          if (config.url.match(externalRequestMatcher)) {
            var token = localStorageService.get('githubKey');

            if (!!token) {
              config.headers['Authorization'] = 'Bearer ' + token;
            }
          }

          return config;
        }
      };
    });
  });


app.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
});