'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NavCtrl', function ($scope, $modal, dataService) {

    $scope.dataService = dataService;

    $scope.currentSearch = '';

    $scope.getInfo = function(e, infoObject) {
      e.stopPropagation();
      window.alert('Info about ' + infoObject + ' is not available at the moment.');
    };

    $scope.log = function(a) {
      console.log(a);
    };

  	//open the settings modal
	  $scope.openSettings = function () {

      console.log(dataService);
	    $modal.open({
	      templateUrl: 'views/settings.html',
	      controller: 'SettingsCtrl'
	      }
	    );
  	};
  });
