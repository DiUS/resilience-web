'use strict';

/* Resilience App Module */

var resilienceModule = angular.module('resilienceApp', ['issueApp', 'filterApp', 'mapApp']);

resilienceModule.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.
	      when('/issues', {templateUrl: 'views/issue_list.html', controller: IssueListController}).
	      when('/issues/:issueId', {templateUrl: 'views/issue.html', controller: IssueController}).
	      when('/map', {templateUrl: 'views/mapView.html', controller: MapController}).
	      otherwise({redirectTo: '/'});
	}]);