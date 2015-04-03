'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the frontendApp
 * Used to control the settings page
 */

function rgb2string(objColor) {
    return 'rgb(' + objColor.r + ', ' + objColor.g + ', ' + objColor.b + ')';
}

function string2rgb(strColor) {
    var a = strColor.split('(')[1].split(')')[0].split(',');
    return {r: parseInt(a[0]), g: parseInt(a[1]), b: parseInt(a[2])};
}

angular.module('frontendApp')
  .controller('SettingsCtrl', function ($scope, $modalInstance, settings) {


    $scope.colors = {
        antagonismColor: rgb2string(settings.colors.antagonismColor),
        synergyColor: rgb2string(settings.colors.synergyColor)
    };

    $scope.$watch('colors', function(newColors) {
        settings.colors.antagonismColor = string2rgb(newColors.antagonismColor);
        settings.colors.synergyColor = string2rgb(newColors.synergyColor);
    }, true);

    $scope.reset = function () {
        $scope.colors = {
        antagonismColor: rgb2string(settings.defaultColors.antagonismColor),
        synergyColor: rgb2string(settings.defaultColors.synergyColor)
        };
    };

    $scope.dismiss = function () {
        $modalInstance.dismiss('cancel');
    };
  });
