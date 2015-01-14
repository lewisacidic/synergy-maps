'use strict';

describe('Controller: NavcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var NavcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavcontrollerCtrl = $controller('NavcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
