'use strict';

function IssueListController($scope, $rootScope, IssueService) {
	$scope.currentDistance = 100; // Defgault distance in Km
	$scope.currentLocation = {};
	
	$scope.getCurrentLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.currentLocation = {};
				$scope.currentLocation.latitude = position.coords.latitude;
				$scope.currentLocation.longitude = position.coords.longitude;
				console.debug("Setting location to: " + $scope.currentLocation.latitude + "," + $scope.currentLocation.longitude);
				
				$scope.getIssues();
			});
		}
	}
	
	// Monitoring map changes
	$scope.$watch(function() {
		return $rootScope.map;
	}, function() {
		console.debug("Map updated");
		
	});
	
	// Monitoring current location
	$scope.$watch(function() {
		console.debug("Checking Current location " + $scope.currentLocation);
		return $scope.currentLocation;
		}, function() {return 0;}
	, false);
	
	$scope.getIssues = function() {
		console.debug("Current location updated to: " + $scope.currentLocation);
		
		if ($scope.currentLocation && $scope.currentLocation.latitude && $scope.currentLocation.longitude) {
			var where = {
				"location": {
					"$nearSphere": {
						"__type": "GeoPoint",
						"latitude": $scope.currentLocation.latitude,
						"longitude":  $scope.currentLocation.longitude
					},
					"$maxDistanceInKilometers": $scope.currentDistance 
				}
			};
			
			where = JSON.stringify(where);
			
			console.log(where)
			//where = encodeURIComponent(where);
			console.log(where);
			
			$scope.issueList = IssueService.get({where: where});
		}
	}
	
	$scope.distance = function(distance) {
		var issueList = IssueService.get({order: '-createdAt'}, function() {
			console.debug("List of issues updated with distance around you: " + distance);
			$scope.issueList = issueList; 
		});
	}
	
	$scope.getCurrentLocation();
}

function CreateIssueController($scope, $rootScope, IssueService) {
	
}

function IssueController() {
	
}

function MapController($scope, $rootScope, MapService, IssueService, $timeout) {
	$scope.issueList = IssueService.get({}, function() {
		// Load locations to the map on successful response
		$timeout($scope.markLocation, 200, true);
	});
	
	$scope.markLocation = function() {
		var map;
		var markers = [];

		var minLat = NaN, maxLat = NaN, minLng = NaN, maxLng = NaN;

		angular.forEach($scope.issueList.results, function(issue, index)
		{
			if (issue.location) {
				var lat = issue.location.latitude;
				var lng = issue.location.longitude;
				
				var location = new google.maps.LatLng(lat, lng);
	
				if(isNaN(minLat) || lat < minLat) minLat = lat;
				if(isNaN(minLng) || lng < minLng) minLng = lng;
				if(isNaN(maxLat) || lat > maxLat) maxLat = lat;
				if(isNaN(maxLng) || lng > maxLng) maxLng = lng;
				
				console.log( minLat + ',' + minLng + ',' + maxLat + ',' + maxLng);
	
				var marker = new google.maps.Marker({
					position: location,
					title: issue.name
				});
	
				markers.push(marker);
			}
		});

		var middlePosition = new google.maps.LatLng((minLat + maxLat)/2, (minLng + maxLng)/2)

		var mapOptions = {
			zoom: 6,
			center: middlePosition,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$rootScope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		angular.forEach(markers, function(marker, index) {
			marker.setMap($rootScope.map);
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
}