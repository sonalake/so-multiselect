/**
* The directive for the select's dropdown list.
*/
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