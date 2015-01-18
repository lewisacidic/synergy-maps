'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:NavcontrollerCtrl
 * @description
 * # NavcontrollerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NavCtrl', function ($scope, $modal) {

  	$scope.representations = ['physicochemical', 'structural', 'biological'];
  	$scope.reductionTechs = ['t-SNE', 'MDS', 'PCA'];
  	$scope.synergyTypes = ['pGamma', 'pBeta', 'Median Excess', 'Highest HSA', 'Excess over Bliss'];
  	$scope.activityTypes = ['pKi', 'pKd', 'IC50'];

  	$scope.currentRep = $scope.representations[0];
  	$scope.currentRed = $scope.reductionTechs[0];
  	$scope.currentSyn = $scope.synergyTypes[0];
  	$scope.currentAct = $scope.activityTypes[0];

  	$scope.representations = $scope.representations.map(
  		function(d) { return {'name': d, 'class':{'active': d === $scope.currentRep}};});

  	$scope.reductionTechs = $scope.reductionTechs.map(
  		function(d) { return {'name': d, 'class':{'active': d === $scope.currentRed}};});

  	$scope.synergyTypes = $scope.synergyTypes.map(
  		function(d) { return {'name': d, 'class':{'active': d === $scope.currentSyn}};});

  	$scope.activityTypes = $scope.activityTypes.map(
  		function(d) { return {'name': d, 'class':{'active': d === $scope.currentAct}};});

  	$scope.currentSearch = null;

  	//open the settings modal
	$scope.openSettings = function () {

	    $modal.open({
	      templateUrl: 'views/settings.html',
	      controller: 'SettingsCtrl'
	      }


	    );
  	};
  });
