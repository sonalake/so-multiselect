angular.module('demo', [
	'so.multiselect'
])

.controller('DemoCtrl', ['$scope', function ($scope) {
	$scope.flavourList = [{
		key: 'f1',
		name: 'Strawberry'
	}, {
		key: 'f2',
		name: 'Classico'
	}, {
		key: 'f3',
		name: 'Mint'
	}];

	$scope.chosenFlavours = [];

	$scope.onFlavourSelected = function(selectedItem) {
		$scope.chosenFlavours = selectedItem;
	};


	// relates to tabs and example code
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