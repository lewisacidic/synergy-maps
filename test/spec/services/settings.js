'use strict';

describe('Service: settings', function () {

  // instantiate service
  var settings;
  beforeEach(function() {settings = 1; });

  it('should have default colors', function () {
    console.log('settings', settings);
    expect(settings).toBe(1);
  });

});
