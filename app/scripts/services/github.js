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
      /**
       * 
       * @returns {
          'login': 'yllieth',
          'id': 1174557,
          'avatar_url': 'https://avatars.githubusercontent.com/u/1174557?',
          'gravatar_id': '5af348622104182c15e66a7388cec51f',
          'url': 'https://api.github.com/users/yllieth',
          'html_url': 'https://github.com/yllieth',
          'followers_url': 'https://api.github.com/users/yllieth/followers',
          'following_url': 'https://api.github.com/users/yllieth/following{/other_user}',
          'gists_url': 'https://api.github.com/users/yllieth/gists{/gist_id}',
          'starred_url': 'https://api.github.com/users/yllieth/starred{/owner}{/repo}',
          'subscriptions_url': 'https://api.github.com/users/yllieth/subscriptions',
          'organizations_url': 'https://api.github.com/users/yllieth/orgs',
          'repos_url': 'https://api.github.com/users/yllieth/repos',
          'events_url': 'https://api.github.com/users/yllieth/events{/privacy}',
          'received_events_url': 'https://api.github.com/users/yllieth/received_events',
          'type': 'User',
          'site_admin': false,
          'name': 'Sylvain',
          'company': 'PredicSis',
          'blog': null,
          'location': 'France',
          'email': null,
          'hireable': false,
          'bio': null,
          'public_repos': 5,
          'public_gists': 2,
          'followers': 0,
          'following': 1,
          'created_at': '2011-11-05T15:50:18Z',
          'updated_at': '2014-07-19T00:48:48Z',
          'private_gists': 3,
          'total_private_repos': 3,
          'owned_private_repos': 3,
          'disk_usage': 12441,
          'collaborators': 1,
          'plan': {
            'name': 'micro',
            'space': 614400,
            'collaborators': 0,
            'private_repos': 5
          }}
       */
      getUserDetails: function() { return Restangular.one('user').get().$object; },
      
      getUserRepos: function() { return Restangular.all('user/repos').getList().$object; },
      
      getOrgsRepos: function() {
        var repos = {};
        Restangular.all('user/orgs').getList().then(function(orgs) {
          for (var i = 0 ; i < orgs.length ; i++) {
            repos[orgs[i].login] = Restangular.one('orgs', orgs[i].login).all('repos').getList().$object;
            repos[orgs[i].login].organization = orgs[i];
          }
        });
        
        return repos;
      }
    };
});
