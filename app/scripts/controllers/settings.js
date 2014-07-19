'use strict';

/**
 * @ngdoc function
 * @name githubApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the githubApp
 */
angular.module('githubApp')
  .controller('SettingsCtrl', function (localStorageService, github) {
    this.profile = {};
    var self = this;
    
    this.getKey = function() {
      this.key = localStorageService.get('githubKey');
      
      if (this.key.length > 0) {
        this.loadProfile();
      }
    };
    
		this.saveKey = function() {
      localStorageService.set('githubKey', this.key);
//      window.alert('key saved !!\n\n' + this.key);
      
      this.loadProfile();
    };
    
    this.loadProfile = function() {
      this.profile = github.getUserDetails();
      this.myRepos = github.getUserRepos();
      this.orgRepos = github.getOrgsRepos();
    };
    
    this.loaded = function() {
      return Object.keys(self.profile).length > 0;
    };
  })
;
