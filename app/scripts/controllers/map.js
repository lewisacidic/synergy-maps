'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MapCtrl', function ($scope, $routeParams, dataService, settings, $window) {

    //locate database from the route
    $scope.datasetName = $routeParams.dataset;

    $scope.settings = settings;

    //set the positional style of the svg, allowing for responsiveness
    $scope.svgStyle = {position: 'absolute',
                  top: '45px',
                  width:  angular.element($window).width(),
                  height: angular.element($window).height() - 45
              };

    //bind function to screen resize event to make it responsive
    $window.onresize = function() {
        $scope.svgStyle.width = angular.element($window).width();
        $scope.svgStyle.height = angular.element($window).height() - 45;
        $scope.$apply();
    };


    //selected information is currently nothing
    $scope.model = dataService.model;


    $scope.tooltip = {visibility: false};

    //setInterval(function() { console.log($scope.model.selected)}, 1000);

    $scope.$watch('tooltip.visibility', function(newVis) {
      if ( newVis === false ) {
        $scope.model.selected = null;
      }
    });

    $scope.select = function(d) {
      $scope.model.selected = d;
    }

    $scope.$watch('model.selected', function(selected) {
        console.log('selected:', selected);


        if (selected === null) {

          $scope.tooltip.visibility = false;

        } else {
          //set up the tooltip for the specific selected item

          $scope.tooltip.visibility = true;

          // if is compound
          if (dataService.data.compounds.indexOf(selected) > -1) {
            var compound = selected;
            console.log(dataService.data.combinations.filter(function(c) { return c.source === selected || c.target === selected }));

            $scope.tooltip.data = {
              compound: true,
              object: compound,
              neighbors: dataService.data.combinations.filter(function(c) { return c.source === selected || c.target === selected })
            }
          }
          // otherwise if is combination
          else if (dataService.data.combinations.indexOf(selected) > -1) {
            var combination = selected
            $scope.tooltip.data = {
              compound: false,
              object: combination
            }

        }}

    });


    dataService.loadExample($routeParams.dataset, function() {
        $scope.data = dataService.data;
    });
});
