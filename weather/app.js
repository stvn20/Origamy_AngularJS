  //Angular.js app definition
  var app = angular.module('origamy',['ngRoute','ui.bootstrap']);

  app.config(function($routeProvider, $httpProvider) {
    $routeProvider
    .when('/', {
      templateUrl : 'partials/index.html',
      controller  : 'mainController'
    })
    .when('/weather/:zipcode/:days', {
      templateUrl : 'partials/weather.html',
      controller  : 'weatherController'
    });

      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];

    });



  //Factory
  app.factory('weatherService',['$http', '$q', function($http, $q) {

    var URL   = 'http://api.openweathermap.org/data/2.5/forecast/daily';

      //Metodos publicos que retorna el factory
      return {

        getWeatherByZipcode : function(zipcode, days){

          var defer = $q.defer();

          $http({
            method:'GET', 
            url:URL,
            params: 
            {
              q: zipcode,
              mode: 'json',
              units: 'metric',
              cnt: days
            }
          }).
          success(function(data, status, headers, config){
            defer.resolve(data);
          }).
          error(function(data, status, headers, config){
            defer.reject(data);
          });

          return defer.promise;
        }

      }

    }]);

  app.controller('weatherController', function($scope, $routeParams, weatherService) {

    $scope.zipcode = $routeParams.zipcode;
    $scope.loading = true;
    $scope.loaded = false;
    $scope.oneAtATime = true;

    weatherService.getWeatherByZipcode($routeParams.zipcode, $routeParams.days).then( function(data){
      $scope.weatherDetails = data;
      $scope.loading = false;
      $scope.loaded = true;
    });

  });

  app.controller('mainController', function($scope, $location) {
    $scope.weather = {
      days: 1
    }

    $scope.getWeather = function () {
      //console.log($scope.weather);
      //$location.path('weather').search({zipcode: '11004', days: 2});
      $location.path('weather/'+ $scope.weather.zipcode + '/' + $scope.weather.days);
    };
  });