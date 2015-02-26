'use strict';

describe('Controller: NavCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var NavcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavcontrollerCtrl = $controller('NavCtrl', {
      $scope: scope
    });
  }));

//test here
});
