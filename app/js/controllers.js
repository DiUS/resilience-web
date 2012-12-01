'use strict';

function IssueListController($scope, $rootScope, IssueService) {
	$scope.issueList = IssueService.get({order: '-createdAt'});
}

function IssueController() {
	
}

function MapController($scope, MapService, IssueService) {
	$scope.issueList = IssueService.get();
	
	
	
	$scope.markLocation = function() {
			var lat = document.getElementById("txtLat");
			var lng = document.getElementById("txtLng");
			var issue = "text";
	        var location = new google.maps.LatLng(lat.value, lng.value);

			var mapOptions = {
				zoom: 6,
				center: location,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

	        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	        var marker = new google.maps.Marker({
	            position: location,
	            map: map,
	            title: issue		
			});
	  }
	
	$scope.getBoundaries = function() {
		var boundaries = {
		};
		
		if ($scope.issueList) {
			angular.forEach($scope.issueList.results, function(issue, index) {
				if (issue.location) {
					
				}
			});
		}
	}

}