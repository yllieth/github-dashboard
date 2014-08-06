'use strict';

/**
 * @ngdoc function
 * @name githubApp.controller:MainCtrl
 * @requires 'ngRoute', 'restangular', 'LocalStorageModule', 'mm.foundation'
 * @description
 * 
 * # MainCtrl
 * Provide data and handle calls of the main page displaying projects feature(s)
 */
angular.module('githubApp')
  .controller('MainCtrl', function (localStorageService, github) {
    var self = this;
    this.names = [];
    this.pullRequests = {};
    this.issues = {};

    /**
     * @property {Object.boolean} Tells wich feature has to be displayed
     * 
     * Note: For each property of this object, this controller has 
     * - an object with the same name wich contains data (ex: @link pullRequests)
     * - a getter function to fetch data from github (ex: @link getPullRequests())
     */
    this.display = {
      pullRequests: true,
      issues: true
    };
    
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Get the list of selected repositories wich have to be displayed in this view.
     * 
     * The `names` array will contain objects like :
     * ```
     * {owner: 'MyCompany', name: 'MyRepositoryName', url: 'https://github.com/MyCompany/Myrepositoryname'}
     * ```
     * 
     * @returns {void}
     */
    this.repositories = function() {
      this.names = localStorageService.get('selectedRepos');
      
      // add url to the stored value
      for (var i = 0; i < this.names.length; i++) {
        this.names[i].url = 'https://github.com/' + this.names[i].owner + '/' + this.names[i].name;
      }
    };

    /**
     * Fetch data from github regarding to the selected features.
     * 
     * @returns {void}
     */
    this.getData = function() {
      if (this.display.pullRequests === true) { this.getPullRequests(); }
      if (this.display.issues === true) { this.getIssues(); }
    };

    /**
     * Empties data
     * 
     * @returns {void}
     */
    this.reset = function() {
      this.pullRequests = {};
      this.issues = {};
    };
    
    /**
     * Returns the number of displayed features
     * 
     * @returns {Number}
     */
    this.getNbFeatures = function() {
      var nb = 0;
      for (var i = 0; i < this.display.length; i++) {
        if (this.display[i] === true) {
          nb++;
        }
      }
      
      return nb;
    };

    // -----------------------------------------------------------------------------------------------------------------
    
    this.getPullRequests = function() {
      this.pullRequests = {};
      
      if (this.display.pullRequests === true) {
        for (var i = 0 ; i < this.names.length ; i++) {
          var repo = this.names[i];
          this.pullRequests[repo.owner + '/' + repo.name] = github.getPullRequest(repo.owner, repo.name);
        }
      }
    };

    this.getIssues = function() {
      this.issues = {};
      
      if (this.display.issues === true) {
        for (var i = 0 ; i < this.names.length ; i++) {
          var repo = this.names[i];
          this.issues[repo.owner + '/' + repo.name] = github.getIssues(repo.owner, repo.name);;
        }
      }
    };
  })
;
