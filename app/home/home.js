
angular.module( 'twitterize.home' , [
	'ui.router',
	'tweet'
])

.config(function config( $stateProvider ) {
  
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeController',
        templateUrl: 'app/home/home.tpl.html'

      }
    },
    data:{ pageTitle: 'Home' }
  });
})
	
.controller( 'HomeController', function ($scope){
		// Nothing to report... (pst: check the tweet module).
})
