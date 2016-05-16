/*! so-multiselect - 0.1.0 - 2016-04-19
 * Copyright (c) 2016 Sonalake;
 */
(function(window, $, angular, undefined) {
'use strict';
	
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
angular.module('multiselect.directive', [])

.directive('soMultiselect', function() {
	return {
		restrict: 'EA',
		scope: {
			filterName: '@name',
			filterItems: '=items',
			filterOnSelected: '&onSelected',
			buttonClasses: '@buttonClass'
		},
		controller: 'MultiSelectController',
		replace: true,
		templateUrl: 'templates/multiselect.tpl.html',
		link: function(scope, element, attrs, dropdownCtrl) {
			if (scope.filterItems && scope.filterItems.length > 0) {
				dropdownCtrl.init( element );
			}
		}
	};
})

/**
 * The directive for the select toggle
 */
.directive('soMultiselectToggle', function() {
	return {
		restrict: 'CA',
		require: '?^soMultiselect',
		link: function(scope, element, attrs, dropdownCtrl) {
			if ( !dropdownCtrl ) {
				return;
			}

			var parent = element.parent();

			dropdownCtrl.toggleElement = element;
			dropdownCtrl.menuElement = angular.element(parent.children()[1]);

			var toggleDropdown = function(event) {
				event.preventDefault();
				if ( !element.hasClass('disabled') && !attrs.disabled ) {
					scope.$apply(function() {
						dropdownCtrl.toggle();
					});
				}
			};

			element.bind('click', toggleDropdown);

			// WAI-ARIA
			element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
			scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
				element.attr('aria-expanded', !!isOpen);
			});

			scope.$on('$destroy', function() {
				element.unbind('click', toggleDropdown);
			});
		}
	};
})
;
angular.module('so.multiselect', [
	// Module children
	'multiselect.controllers',
	'multiselect.directive',
	'multiselect.services'
])

.constant('MultiSelectConfig', {
	openClass: 'open'
})

.run(['$templateCache', function($templateCache) {
	$templateCache.put('templates/multiselect.tpl.html',
	'<div class="multiselect-container">\n' +
	'    <button class="btn {{buttonClasses}} so-multiselect-toggle" ng-click="open=!open">\n' +
	'        <div class="filter-wrap"><span class="filter-label">{{filterName}}:</span> <span class="filter-values">{{selectedItemsString}}</span></div>\n' +
	'        <span class="caret" ng-if="filterItems.length > 0"></span>\n' +
	'    </button>\n' +
	'    <ul class="multiselect-menu" aria-labelledby="dropdownMenu">\n' +
	'        <li ng-repeat="item in filterItems" ng-click="selectedItems()">\n' +
	'            <input type="checkbox" ng-model="item.selected" /><span ng-click="itemSelected($index)">{{item.name}}</span>\n' +
	'        </li>\n' +
	'    </ul>\n' +
	'</div>\n' +
	'');
}])

;
angular.module('multiselect.services', [])

.service('MultiSelectService', ['$document', function($document) {
	var openScope = null,
		closeDropdown = function( evt ) {
			var toggleElement = openScope.getToggleElement();
			var menuElement = openScope.getMenuElement();
			if ( evt && toggleElement && toggleElement[0].contains(evt.target) ) {
				return;
			} else if ( evt && menuElement && menuElement[0].contains(evt.target) ) {
				return;
			}

			openScope.$apply(function() {
				openScope.isOpen = false;
			});
		},
		escapeKeyBind = function( evt ) {
			if ( evt.which === 27 ) {
				openScope.focusToggleElement();
				closeDropdown();
			}
		}
	;

	this.open = function( dropdownScope ) {
		if ( !openScope ) {
			$document.bind('click', closeDropdown);
			$document.bind('keydown', escapeKeyBind);
		}

		if ( openScope && openScope !== dropdownScope ) {
			openScope.isOpen = false;
		}

		openScope = dropdownScope;
	};

	this.close = function( dropdownScope ) {
		if ( openScope === dropdownScope ) {
			openScope = null;
			$document.unbind('click', closeDropdown);
			$document.unbind('keydown', escapeKeyBind);
		}
	};
}])

;

})(window, window.$, window.angular);