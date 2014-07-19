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
    
    this.since = function(createdAt) {
      var creationDate = new Date(createdAt);
      var nowDate = new Date();
      
      var diff = '';
      var diffMs = nowDate - creationDate;
      var diffSec = Math.round(diffMs/1000);
      var diffMin = Math.round(diffSec/60); if (diffMin === 0) { return diffSec + ' secondes' + ((diffSec > 1) ? 's' : ''); }
      var diffHrs = Math.round(diffMin/60); if (diffHrs === 0) { return diffMin + ' minutes' + ((diffMin > 1) ? 's' : ''); }
      var diffDay = Math.round(diffHrs/24); if (diffDay === 0) { return diffHrs + ' hours' + ((diffHrs > 1) ? 's' : ''); }
      var diffMth = Math.round(diffDay/30); if (diffMth === 0) { return diffDay + ' day' + ((diffDay > 1) ? 's' : ''); } 
      
      return diffMth + ' months' + ((diffMth > 1) ? 's' : '');
    };
  })
;
