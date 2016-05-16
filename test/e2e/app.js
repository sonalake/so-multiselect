angular.module('demo', [
	'so.multiselect'
])

.controller('DemoCtrl', ['$scope', function ($scope) {
	// the selector config
	$scope.things = [{
		key: 't1',
		name: 'Thing 1'
	}, {
		key: 't2',
		name: 'Thing 2'
	}, {
		key: 't3',
		name: 'Thing 3'
	}];

	$scope.items = [];

	$scope.onThingsSelected = function(selectedItem) {
		$scope.items = selectedItem;
	};


	$scope.demo1 = {
		markup: true,
		javascript: false
	};
	$scope.toggleDemo1 = function(e, markup) {
		e.preventDefault();
		if (markup) {
			$scope.demo1.javascript = false;
			$scope.demo1.markup = true;
		} else {
			$scope.demo1.markup = false;
			$scope.demo1.javascript = true;
		}
	};
}])

;