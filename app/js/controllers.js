'use strict';

function IssueListController($scope, $rootScope, IssueService) {
	$scope.issueList = IssueService.get();
}

function IssueController() {
	
}