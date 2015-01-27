'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, settings, dataService) {

    $scope.colors = settings.colors;

    dataService.getExampleList(function() {

        console.log(dataService.exampleList);

        dataService.loadExample(dataService.exampleList[0], function () { console.log('DataService: ', dataService); });

        $scope.$apply();


    });

    $scope.logger = function() {
        console.log(settings.colors.antagonismColor, settings.colors.synergyColor);
        console.log($scope.colors.antagonismColor, $scope.colors.synergyColor);
    };
  });
