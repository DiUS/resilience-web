'use strict';

function IssueListController($scope, $rootScope, IssueService) {
	$scope.issueList = IssueService.get({order: '-createdAt'});
}

function IssueController() {
	
}