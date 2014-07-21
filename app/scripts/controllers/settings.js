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
      nbPerPage: 8,   // max number of displayed repos on a page
      max: 3          // max number of displayed pages, next page number will be replaced by ...
    };
    this.search = {};
    this.searchfield = {};

    this.profile = {};
    this.selectedRepos = [];
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

    this.selected = function(repoId, repoOwner){
      var repoList = getRepoListFromOwner(repoOwner);
      var repo = searchForRepo('id', repoId, repoList);
      var present = searchForRepo('name', repo.object.name, this.selectedRepos);
      if (repo !== false) {
        var updated = false;
        if (repo.object.selected === true && present === false) {
          // add a selected repo if not already present
          this.selectedRepos.push({name: repo.object.name, owner: repo.object.owner.login});
          updated = true;
        }

        if (repo.object.selected === false && present !== false) {
          // remove a selected repo
          this.selectedRepos.splice(present.index, 1);
          updated = true;
        }

        if (updated === true) {
          localStorageService.set('selectedRepos', JSON.stringify(this.selectedRepos));
        }
      }
    };

    this.printSelectedRepos = function() {
      return $.map(this.selectedRepos, function(val, i) { return val.name; }).join(', ');
    };
  })
;
