'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:synergyMap
 * @description
 * # synergyMap
 */
angular.module('frontendApp')
  .directive('synergyMap', function () {
    return {
      template: '<svg class="synergy-map" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
          '</svg>',
      restrict: 'E',
      link: function postLink(attrs, element, scope) {
        data = attrs['data'];
      }
    };
  });
