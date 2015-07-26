myApp = angular.module('starter-twitter-sentiment-app', ['ngRoute', 'LocalStorageModule', 'appRoutes', 'MainCtrl', 'MainService', 'AboutCtrl']);

// setup localStorage
myApp.config(function(localStorageServiceProvider) {
	localStorageServiceProvider
		.setPrefix('starter-twitter-sentiment-app')
    	.setStorageType('sessionStorage');
});

// UI hacks
$(document).ready(function() {

	// Update nav bar active item when clicked
	$(".nav a").on("click", function(){
		$(".nav").find(".active").removeClass("active");
   		$(this).parent().addClass("active");
	});
	
});