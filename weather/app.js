  //Angular.js app definition
  var app = angular.module('origamy',['ui.bootstrap']);



  //Configura el APP para CORS requests
  app.config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });



  //Factory
  app.factory('weatherService',['$http', '$q', function($http, $q) {

    var apiEndpoint   = 'http://api.openweathermap.org/data/2.5/forecast/daily';

      //Metodos publicos que retorna el factory
      return{

        getWeather : function(weather, unit) {
          var deferred = $q.defer();
          
          unit = typeof unit !== 'undefined' ? unit : 'metric';
          var uri = apiEndpoint + "?q=" + weather.zipcode + "&mode=json&units=" + unit + "&cnt="+ weather.days;
          //console.log(uri);
          //$http.post(uri).
          $http({ 
            method: 'POST', 
            url: uri 
          }).
          success(function(data, status) {
            deferred.resolve(data);
          }).
          error(function (error, status) {
            deferred.reject(error);
          });

          return deferred.promise;
        }

      }

    }]);


  //Controller
  app.controller('OrigamyCtrl', ['$scope', 'weatherService', function($scope, weatherService){

    $scope.loading = false;
    $scope.loaded = false;
    $scope.oneAtATime = true;
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
    
    $scope.getWeather = function () {
      $scope.loading = true;

      weatherService.getWeather($scope.weather).then(function(data) {

        $scope.weatherDetails = data;
          //Hide spinner
          $scope.loading = false;
          //Display info
          $scope.loaded = true;
        });

    };


  }]);