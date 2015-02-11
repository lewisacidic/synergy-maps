'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MapCtrl', function ($scope, $routeParams, dataService, $window) {

    //locate database from the route
    $scope.datasetName = $routeParams.dataset;

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
    $scope.model = {selected: null, highlighted: []};


    $scope.tooltip = {title: 'Dynamic title', 
                      content: [
                        {title: 'you shouldn\'t be able to', content:'see this'}, 
                        ],
                      visibility: false};

    //setInterval(function() { console.log($scope.model.selected)}, 1000);

    $scope.$watch('tooltip.visibility', function(newVis) {
      if ( newVis === false ) {
        $scope.model.selected = null;
      }
    });

    $scope.$watch('model.selected', function(selected) {
        console.log('selected:', selected);


        if (selected === null) {

          $scope.tooltip.visibility = false;

        } else {
          //set up the tooltip for the specific selected item

          $scope.tooltip.visibility = true;

          // if is compound
          if (dataService.data.compounds.indexOf(selected) > 0) {
            $scope.tooltip.title = selected.Name;
            $scope.tooltip.content = [
                {title: 'structure', content: '<div>pretty picture</div>'},
                {title: 'activity', content: 'IC50: ' + selected.IC50}
              ];
          }
          // otherwise if is combination
          else if (dataService.data.combinations.indexOf(selected) > 0) {
            $scope.tooltip.title = 'Combination';
            $scope.tooltip.content = [
                {title: 'components', content: selected.source.Name + ' and ' + selected.target.Name}
                ];
          }

        } 

    });


    dataService.loadExample($routeParams.dataset, function() {
        $scope.data = dataService.data;
    });
});
