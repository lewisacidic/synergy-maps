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
        synergyColor: '#0000FF',
        antagonismColor: '#FF0000'};


    this.colors = $.extend(true, {}, this.defaultColors);

  });
