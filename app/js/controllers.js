'use strict';

function IssueListController($scope, $rootScope, IssueService) {
	$scope.issueList = IssueService.get({order: '-createdAt'});
}

function IssueController() {
	
}

function MapController($scope, MapService, IssueService, $timeout) {
	$scope.issueList = IssueService.get();
	
	$scope.markLocation = function() {
		var boundaryBox = $scope.getBoundaries();
		
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
				left: 0,
				bottom: 0,
				right: 0,
				top: 0
		};
		
		if ($scope.issueList) {
			angular.forEach($scope.issueList.results, function(issue, index) {
				
				if (issue.location) {
					if (issue.location.latitude < boundaries.left) {
						boundaries.left = issue.location.latitude; 
					}
					
					if (issue.location.latitude > boundaries.right) {
						boundaries.right = issue.location.latitude; 
					}
					
					if (issue.location.longitude < boundaries.bottom) {
						boundaries.bottom = issue.location.longitude; 
					}
					
					if (issue.location.longitude > boundaries.top) {
						boundaries.top = issue.location.longitude; 
					}
				}
			});
		}
		
		return boundaries;
	}

	$timeout($scope.markLocation, 2000, true);
}