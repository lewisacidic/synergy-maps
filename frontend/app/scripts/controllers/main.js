'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, dataService) {

    dataService.getExampleList().then(
        function () {
            dataService.empty();
            $scope.datasets = dataService.exampleList;
        }
    );

    
  });
