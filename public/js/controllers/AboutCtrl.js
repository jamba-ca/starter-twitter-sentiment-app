angular.module('AboutCtrl', []).controller('AboutController', function($scope) {
	if (window.location.pathname == '/about') {
		$('#navAbout').addClass("active");
	}

	$scope.tagline = 'Feel free to modify and extend this project!';	
});