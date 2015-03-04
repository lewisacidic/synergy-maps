'use strict';

/**
 * @ngdoc service
 * @name frontendApp.settings
 * @description
 * # settings
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('settings', function () {

    this.defaultColors = {
        synergyColor: {r: 0, g: 0, b: 255},
        antagonismColor: {r: 255, g: 0, b: 0}
    };

    this.colors = $.extend(true, {}, this.defaultColors);

    this.combinationThickness = 20;
    this.activityThickness = 20;
  });
