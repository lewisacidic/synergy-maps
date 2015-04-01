'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NavCtrl', function ($scope, $modal, dataService, SweetAlert) {

    $scope.dataService = dataService;

    $scope.currentSearch = '';


    $scope.getInfo = function(e, infoObject) {
      e.stopPropagation();
      console.log(dataService.metadata);
      SweetAlert.swal({
        title: infoObject, 
        html: dataService.metadata[infoObject],
        allowOutsideClick: true,

      });
    };

    $scope.select = function(a) {
      dataService.model.selected = a;
      console.log(dataService.model.selected);
    };

  	//open the settings modal
	  $scope.openSettings = function () {

	    $modal.open({
	      templateUrl: 'views/settings.html',
	      controller: 'SettingsCtrl'
	      }
	    );
  	};

    //open the info modal
    $scope.openInfo = function () {

      $modal.open({
        templateUrl: 'views/info.html',
        controller: 'InfoCtrl'
        }
      );
    };
  });
