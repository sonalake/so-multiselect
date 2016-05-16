/**
 * Services to help the select.
 */
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