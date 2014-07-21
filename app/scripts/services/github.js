'use strict';

/**
 * @ngdoc service
 * @name githubApp.github
 * @description
 * # github
 * Factory in the githubApp.
 */
angular.module('githubApp')
  .factory('github', function (Restangular) {
    return {
      getUserDetails: function() { return Restangular.one('user').get(); },

      getUserRepos: function() { return Restangular.all('user/repos').getList(); },

      getOrgsRepos: function() {
        return Restangular.all('user/orgs').getList().then(function(orgs) {
          var repos = {};

          for (var i = 0 ; i < orgs.length ; i++) {
            repos[orgs[i].login] = Restangular.one('orgs', orgs[i].login).all('repos').getList();
          }

          return repos;
        });
      },

      getPullRequest: function(owner, repo) {
        return Restangular.one('repos', owner).one(repo).all('pulls').getList().$object;
      }
    };
});
