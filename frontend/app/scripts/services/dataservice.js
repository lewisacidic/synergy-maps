'use strict';

/**
 * @ngdoc service
 * @name frontendApp.dataService
 * @description
 * # dataService
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('dataService', function ($http, $q) {
    // Service logic
    // ...

    // create the service to be returned by the factory
    var dataService = {};
    
    //list of examples
    dataService.exampleList = [];

    dataService.getExampleList = function(callback) {
      
      var delay = $q.defer();

      $http.get('data/metadata.json')
        .then(function (response) {
          dataService.exampleList.length = 0;
          response.data.datasets.forEach(function(d) {
            dataService.exampleList.push(d);
          });

          delay.resolve(response);
      })
        .then(callback);

      return delay.promise;
    };

    //initially, there is no data
    dataService.data = null;

    //initially, there are no representations in data
    dataService.available = {
      representationTypes: [],
      dimensionalityReductionTypes: [],
      synergyTypes: [],
      activityTypes: []
    };

    //initially, there is no active spaces
    dataService.current = {
      representationType: null, 
      dimensionalityReductionType: null, 
      synergyType: null, 
      activityType: null
    };
    

    //
    // api for changing the data
    //

    // doesn't touch the data directly, calls setDimensionalityReductionType to actually change the data
    dataService.setRepresentationType = function (newRepresentationType) {

      console.log('Set representation to ' + newRepresentationType);
      dataService.current.representationType = newRepresentationType;

      // empty the dimredtype array
      dataService.available.dimensionalityReductionTypes.length = 0;

      // refill the dimeredtype array with new data
      Object.keys(dataService.data.representations[this.current.representationType])
        .forEach(function(d) { dataService.available.dimensionalityReductionTypes.push(d); });

      // if the previous dimensionality reduction technique has been applied to the new representation, keep.  Otherwise set to new.
      if (dataService.available.dimensionalityReductionTypes.indexOf(dataService.current.dimensionalityReductionType) > -1) {
        
        // leave the space as is, change the data
        dataService.setDimensionalityReductionType(dataService.current.dimensionalityReductionType);
      }
      else {
        // set the space to the current
        dataService.setDimensionalityReductionType(dataService.available.dimensionalityReductionTypes[0]);
      }
    };

    //
    dataService.setDimensionalityReductionType = function (newDimRedType) {

      console.log('Set dim red type:' + newDimRedType);

      // should check if is a member of available
      this.current.dimensionalityReductionType = newDimRedType;

      //cache the rep to load the coordinates from
      var rep = this.data.representations[this.current.representationType][this.current.dimensionalityReductionType];

      //change data
      this.data.compounds.forEach(function(d) {
        d.X = rep[d.id].X;
        d.Y = rep[d.id].Y;
      });
    };

    dataService.setSynergyType = function (newSynergyType) {
      console.log('Set synergy type:', newSynergyType);

      // should check if is a member of available
      dataService.current.synergyType = newSynergyType;

    };

    // use to change the activity type
    dataService.setActivityType = function (newActivityType) {

      console.log('Set activityType:', newActivityType);

      // should check if is a member of available
      dataService.current.activityType = newActivityType;
      
    };

    // link the edges of the data up
    dataService.linkUp = function () {

      var compObj = {};

      this.data.compounds.forEach(function(d) {
        d.combinations = [];
        compObj[d.id] = d;
      });

      this.data.combinations.forEach(function(d) {

        d.source = compObj[d.ColId];
        d.target = compObj[d.RowId];
        
      });

      return this;
    };

    //remove all the data
    dataService.empty = function () {
      this.available.representationTypes.length = 0;
      this.available.dimensionalityReductionTypes.length = 0;
      this.available.synergyTypes.length = 0;
      this.available.activityTypes.length = 0;
      this.current.representationType = null;
      this.current.dimensionalityReductionType = null;
      this.current.synergyType = null;
      this.current.activityType = null;
      return this;
    };

    dataService.initializeData = function () {
      
      // remove old representation types if any previously existed
      this.empty();

      // add representation types
      Object.keys(this.data.representations)
        .forEach(function(d) { dataService.available.representationTypes.push(d); });
      
      //
      // set current representation type to be first in the list 
      // (also sets the dimRedType and current dimredtype as these are dependent)
      //

      this.setRepresentationType(this.available.representationTypes[0]);

      // add activity types
      this.data.metadata.activityTypes.forEach(function(d) {
        dataService.available.activityTypes.push(d);
      });
      // set current activity type to be first in the list
      this.setActivityType(this.available.activityTypes[0]);

      // add synergy types 
      this.data.metadata.synergyTypes.forEach(function(d) {
        dataService.available.synergyTypes.push(d);
      });

      // set current synergy type to be first in the list
      this.setSynergyType(this.available.synergyTypes[0]);

      // set first in list to be active
      this.linkUp();

      return this;
    };

    // load up an example dataset
    dataService.loadExample = function(name, callback) {
      
      var delay = $q.defer();

      $http.get('data/' + name + '/data.json')
        .then(function(response) {
          //retrieve the data as a property
          dataService.datasetName = name;
          dataService.data = response.data;
          //process the data
          dataService.initializeData();

          return delay.resolve(response); 
        })
        .then(callback);

      return delay.promise;
    };


    return dataService;
  });
