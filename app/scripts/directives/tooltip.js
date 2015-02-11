'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:tooltip
 * @description
 * # tooltip
 */
angular.module('frontendApp')
  .directive('tooltip', function () {

    return {
        scope: {visibility: '=', content: '=', title: '=', height: '@'},
        templateUrl: 'views/tooltipTemplate.html',
        restrict: 'E',
        link: function postLink(scope, elements) {
            
            var parent = $(elements[0]);

            //make responsive
            scope.$watch('height', function() {
                parent.css('max-height', scope.height + 'px');
            });

            scope.close = function() {
                scope.visibility = false;
            }


            scope.$watch('visibility', function(newVisibility, oldVisibility) {
                if (newVisibility) {
                    parent.show(400);
                } else {
                    parent.hide(400);
                };
            })


        }
    };
  });
