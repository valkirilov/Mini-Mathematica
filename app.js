'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'ngAnimate',

  'myApp.calculator',
  'myApp.services',

  //'restangular',
  'ui.bootstrap',
  //'chieffancypants.loadingBar',
  'gettext',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/calculator'});
}])
.controller('GlobalController', ['$scope', '$rootScope', '$location', 'gettextCatalog',
  function($scope, $rootScope, $location, gettextCatalog) {

  $scope.lang = "en";

  $scope.setLanguage = function(language) {
    $scope.lang = language;
    gettextCatalog.currentLanguage = language;
  };

}]);