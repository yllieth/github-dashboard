'use strict';

describe('Filter: since', function () {

  // load the filter's module
  beforeEach(module('githubApp'));

  // initialize a new instance of the filter before each test
  var since;
  beforeEach(inject(function ($filter) {
    since = $filter('since');
  }));

  it('should return the input prefixed with "since filter:"', function () {
    var text = 'angularjs';
    expect(since(text)).toBe('since filter: ' + text);
  });

});
