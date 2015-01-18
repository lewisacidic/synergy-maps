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
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the synergyMap directive');
      }
    };
  });
