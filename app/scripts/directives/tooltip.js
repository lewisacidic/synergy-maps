'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:tooltip
 * @description
 * # tooltip
 */
angular.module('frontendApp')
  .directive('tooltip', function (dataService) {

    return {
        scope: {visibility: '=', data: '=', height: '@', click: "="},
        templateUrl: 'views/tooltipTemplate.html',
        restrict: 'E',
        link: function postLink(scope, elements) {
            
            var parent = $(elements[0]);

            scope.dataService = dataService;
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
