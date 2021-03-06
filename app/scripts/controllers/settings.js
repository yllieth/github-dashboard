'use strict';

/**
 * @ngdoc function
 * @name githubApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the githubApp
 */
angular.module('githubApp')
  .controller('SettingsCtrl', function (localStorageService, github, Restangular) {
    this.pagination = {
      nbPerPage: 6,    // max number of displayed repos on a page
      max: 3,          // max number of displayed pages, next page number will be replaced by ...
      emptyLinesIterator: function(numberItems) {
        var nbEmptyLines = (self.pagination.nbPages(numberItems) * self.pagination.nbPerPage) - numberItems;
        var iterator = [];
        for (var i = 0; i < nbEmptyLines; i++) { iterator.push(i); }
        
        return iterator;
      },
      nbPages: function(numberItems) {
        return Math.ceil(numberItems / self.pagination.nbPerPage);
      }
    };
    this.search = {};
    this.searchfield = {};

    this.profile = {};
    this.selectedRepos = [];
    this.extraRepo = {invalid: true};
    var self = this;

    var searchForRepo = function(property, value, repoList) {
      if (angular.isArray(repoList)) {
        for (var i = 0 ; i < repoList.length ; i++) {
          if (repoList[i][property] === value) {
            return {index: i, object: repoList[i]};
          }
        }
      }

      return false;
    };

    var getRepoListFromOwner = function(owner, me) {
      var repoList;
      me = me || 'me';

      if (owner === me) {
        repoList = self.myRepos;
      } else {
        for (var i = 0 ; i < self.orgRepos.length ; i++) {
          if (self.orgRepos[i].details.login === owner){
            repoList = self.orgRepos[i].repos;
            break;
          }
        }
      }

      return repoList;
    };

    // -----------------------------------------------------------------------------------------------------------------

    this.authenticate = function(fullAccess) {
      OAuth.initialize((fullAccess === true) ? 'H9DJ6ZpMKMX0yR7asJny6tamHhQ' : 'KY7eN-DfVV3M0S0C4q_VrQf1yhU');
      OAuth.popup('github')
          .done(function(result) {
            localStorageService.set('githubKey', result.access_token);
            localStorageService.set('githubType', (fullAccess === true) ? 'full' : 'public');
            self.init();
          })
          .fail(function (err) {
            console.log(err);
      });
    };

    this.init = function() {
      this.key = localStorageService.get('githubKey');

      if (this.key && this.key.length > 0) {
        this.loadProfile();
      }
    };

    this.loadProfile = function() {
      // data from github
      github.getUserDetails().then(function(profile) {
        self.profile = profile;

        github.getUserRepos().then(function(repos) {
          self.myRepos = repos;

          github.getOrgsRepos().then(function(orgs) {
            self.orgRepos = [];
            for (var org in orgs) {
              orgs[org].then(function(repos) {
                self.orgRepos.push({
                  details: (repos.length > 0) ? repos[0].owner : org,
                  repos: repos
                });

                // data from localStorage
                var selectedReposFromLS = localStorageService.get('selectedRepos');
                if (selectedReposFromLS) {
                  self.selectedRepos = selectedReposFromLS;
                }

                for (var i = 0 ; i < self.selectedRepos.length ; i++) {
                  if (self.selectedRepos[i].owner === self.profile.login) {
                    var repo = searchForRepo('name', self.selectedRepos[i].name, self.myRepos);
                    if (repo !== false) {
                      self.myRepos[repo.index].selected = true;
                    }
                  } else {
                    var repo = searchForRepo('name', self.selectedRepos[i].name, self.orgRepos[0].repos);
                    if (repo !== false) {
                      self.orgRepos[0].repos[repo.index].selected = true;
                    }
                  }
                }
              });
            }
          });
        });
      });
    };

    this.loaded = function() {
      return Object.keys(self.profile).length > 0;
    };

    this.selected = function(repoOwner, repoName){
      var repoList = getRepoListFromOwner(repoOwner);
      var repo = searchForRepo('name', repoName, repoList);
      var updated = false;
      var present = (repoList === undefined)
        ? searchForRepo('name', repoName,         this.selectedRepos)
        : searchForRepo('name', repo.object.name, this.selectedRepos);
      
      if (present === false && repo !== false && repo.object.name !== undefined && repo.object.owner.login !== undefined) {
        // add a selected repo if not already present
        this.selectedRepos.push({name: repo.object.name, owner: repo.object.owner.login});
        updated = true;
      }

      if (present !== false && present.index >= 0) {
        // remove a selected repo
        this.selectedRepos.splice(present.index, 1);
        if (repo !== false) { repo.object.selected = false; }
        updated = true;
      }

      
      if (updated === true) {
        localStorageService.set('selectedRepos', JSON.stringify(this.selectedRepos));
      }
    };

    this.printSelectedRepos = function() {
      return $.map(this.selectedRepos, function(val, i) { return val.name; }).join(', ');
    };
    
    this.url2Repo = function() {
      var parse = this.extraRepo.url.match(/https:\/\/github.com\/([a-zA-Z0-9\_\-]*)\/([a-zA-Z0-9\_\-]*)/);
      if (angular.isArray(parse)) {
        this.extraRepo.owner = parse[1];
        this.extraRepo.name = parse[2];
        this.extraRepo.invalid = false;
      } else {
        this.extraRepo.owner = '';
        this.extraRepo.name = '';
        this.extraRepo.invalid = true;
      }
    };
    
    this.addExtraRepo = function(){
      var newRepo = { owner: this.extraRepo.owner, name: this.extraRepo.name };
      this.selectedRepos.push(newRepo);
      localStorageService.set('selectedRepos', JSON.stringify(this.selectedRepos));
    };
  })
;
