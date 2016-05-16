/**
 * Custom AngularJS 1.2 dropdown select with checkboxes.
 * Part of DANU's internal Forge JS library.
 */
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