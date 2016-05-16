/**
 * Controllers for the select.
 */
angular.module('multiselect.controllers', [])

.controller('MultiSelectController', ['$scope', '$attrs', '$parse', '$filter', 'MultiSelectConfig', 'MultiSelectService', function($scope, $attrs, $parse, $filter, MultiSelectConfig, MultiSelectService) {
	var self = this,
		scope = $scope.$new(), // create a child scope so we are not polluting original one
		openClass = MultiSelectConfig.openClass,
		getIsOpen,
		setIsOpen = angular.noop,
		toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
		skipOnSelectedCallback = true
	;

	this.init = function( element ) {
		self.$element = element;

		if ( $attrs.isOpen ) {
			getIsOpen = $parse($attrs.isOpen);
			setIsOpen = getIsOpen.assign;

			$scope.$watch(getIsOpen, function(value) {
				scope.isOpen = !!value;
			});
		}
		
		$scope.selectedItems();
	};

	this.toggle = function( open ) {
		scope.isOpen = arguments.length ? !!open : !scope.isOpen;
		return scope.isOpen;
	};

	// Allow other directives to watch status
	this.isOpen = function() {
		return scope.isOpen;
	};

	scope.getToggleElement = function() {
		return self.toggleElement;
	};

	scope.getMenuElement = function() {
		return self.menuElement;
	};

	scope.focusToggleElement = function() {
		if ( self.toggleElement ) {
			self.toggleElement[0].focus();
		}
	};

	$scope.itemSelected = function(index) {
		if ( $scope.filterItems[index] ) {
			$scope.filterItems[index].selected = !$scope.filterItems[index].selected;
		}
	};

	$scope.selectedItemsString = 'All';
	$scope.selectedItems = function() {
		var options = $filter('filter')($scope.filterItems, {selected: true}),
			selectedNames = '';

		if (options.length === 0) {
			selectedNames = 'All';
		} else {
			for (var i = 0; i < options.length; i++) {
				selectedNames += options[i].name;
				if (i !== options.length-1) {
					selectedNames += ', ';
				}
			}
		}
		// we want to update the string once, instea dof gradually building it up as angular would keep refreshing.
		$scope.selectedItemsString = selectedNames;
		// we don't want to execute the onSelected callback method the first time through
		if (!skipOnSelectedCallback) {
			scope.filterOnSelected({ selectedItems: options });
		} else {
			skipOnSelectedCallback = false;
		}
	};

	scope.$watch('isOpen', function( isOpen, wasOpen ) {
		if(isOpen) {
			self.$element.addClass(openClass);
		} else {
			self.$element.removeClass(openClass);
		}

		if ( isOpen ) {
			scope.focusToggleElement();
			MultiSelectService.open( scope );
		} else {
			MultiSelectService.close( scope );
		}

		setIsOpen($scope, isOpen);
		if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
			toggleInvoker($scope, { open: !!isOpen });
		}
	});

	$scope.$on('$locationChangeSuccess', function() {
		scope.isOpen = false;
	});

	$scope.$on('$destroy', function() {
		scope.$destroy();
	});

}])
;