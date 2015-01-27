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
    $scope.currentSearch = null;

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
