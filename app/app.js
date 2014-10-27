/**
* App Module
* Image List Demonstration app
*/
angular.module ( 'imageListApp', [
  'imageListApp.imageList',
  'dhk.imageGrid',
  'ngSanitize'
])

.config (function( $stateProvider, $urlRouterProvider ) { $urlRouterProvider.otherwise( '/imageList' );  })
.run (function (){ /* Use the run method to execute any code after services have been instantiated. */ })

.controller( 'AppController', function ( $scope, $location, $templateCache) {});












