'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the frontendApp
 * Used to control the settings page
 */


angular.module('frontendApp')
  .controller('SettingsCtrl', function ($scope) {
   

    $scope.defaultSynergyColor = '#0000FF';
    $scope.defaultAntagonismColor = '#FF0000';

    $scope.reset = function() {
        console.log($scope.synergyColor);
        $scope.synergyColor = $scope.defaultSynergyColor;
        $scope.antagonismColor = $scope.defaultAntagonismColor;
    };

    $scope.reset();

  });
