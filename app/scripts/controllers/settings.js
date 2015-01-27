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
  .controller('SettingsCtrl', function ($scope, $modalInstance, settings) {

    $scope.colors = settings.colors;

    $scope.$watch('colors', function(newColors) {
        settings.colors = newColors;
        console.log('Changed color');
    });

    $scope.colorBlindMode = function () {
        settings.colors.antagonismColor = '#AAAAAA';
        settings.colors.synergyColor = '#333333';
    };

    $scope.reset = function () {
        settings.colors.antagonismColor = '#FF0000';
        settings.colors.synergyColor = '#0000FF';
    };

    $scope.dismiss = function () {
        $modalInstance.dismiss('cancel');
    }
  });
