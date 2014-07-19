'use strict';

/**
 * @ngdoc function
 * @name githubApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the githubApp
 */
angular.module('githubApp')
  .controller('MainCtrl', function (localStorageService, github) {
    var self = this;
  
    this.display = {
      pullRequests: true
    };
    
    this.repositories = function() {
      this.names = localStorageService.get('selectedRepos');
    };
    
    this.getData = function() {
      if (this.display.pullRequests) {
        this.getPullRequests();
      }
    };
    
    this.getPullRequests = function() {
      this.pullRequests = {};
      for (var i = 0 ; i < this.names.length ; i++) {
        var repo = this.names[i];
        this.pullRequests[repo.owner + '/' + repo.name] = github.getPullRequest(repo.owner, repo.name);
      }
    };
    
    this.reset = function() {
      this.pullRequests = {};
    };
  })
;
