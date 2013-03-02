angular.module('tabModule', []).
directive('uiTabs', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: function($scope, $element) {
			var panes = $scope.panes = [];
			$scope.select = function(pane) {
				angular.forEach(panes, function(pane) {
					pane.selected = false;
				});
				pane.selected = true;
			}
			this.addPane = function(pane) {
				if (panes.length == 0) $scope.select(pane);
				panes.push(pane);
			}
		},
		templateUrl: 'modules/tab-module/partials/tab.html',
		replace: true
	};
}).
directive('uiPane', function() {
	return {
		require: '^uiTabs',
		restrict: 'E',
		transclude: true,
		scope: { title: '@' },
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addPane(scope);
		},
		template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>',
		replace: true
	};
});