describe("Sonalake Multi-Select", function() {
	'use strict';

	// load the module
	beforeEach(module('so.multiselect'));

	/**
	 * Tests the MultiSelectService service.
	 */
	describe('MultiSelectService services', function() {
		var MultiSelectService;
		
		beforeEach(function() {
			inject(function($injector) {
				MultiSelectService = $injector.get('MultiSelectService');
			});
		});

		it('should be properly instantiated', function () {
			expect(MultiSelectService).toBeDefined();
			expect(MultiSelectService.open).toBeDefined();
			expect(MultiSelectService.close).toBeDefined();
		});
	});

	/**
	 * Tests the MultiSelectController Controller.
	 */
	describe('MultiSelectController', function() {
		var controllerFactory, scope, rootScope, MultiSelectService, isolated;

		// inject any angular services
		beforeEach(inject(['$controller', '$rootScope', '$compile', 'MultiSelectService', function ($controller, $rootScope, $compile, MultiSelectService) {
			rootScope = $rootScope;

			scope = $rootScope.$new();
			scope.things = [{
				key: 't1',
				name: 'Thing 1'
			}, {
				key: 't2',
				name: 'Thing 2'
			}, {
				key: 't3',
				name: 'Thing 3'
			}];
			scope.items = [];
			scope.onThingsSelected = function(selectedItem) {
				scope.items = selectedItem;
			};

			var element = $compile('<div so-multiselect items="things" name="Thing" on-selected="onThingsSelected(selectedItems)" button-class="btn-grey"></div>')(scope);
			controllerFactory = $controller;
			scope.$digest();
			isolated = element.isolateScope();
		}]));
		
		it('should be properly instantiated', function() {
			expect(isolated.itemSelected).toBeDefined();
			expect(isolated.selectedItemsString).toBe('All');
			expect(isolated.selectedItems).toBeDefined();
		});
		it('should toggle if an item is selected', function() {
			expect(isolated.itemSelected).toBeDefined();
			expect(scope.items.length).toBe(0);
			expect(scope.things[0].selected).toBeFalsy();
			isolated.itemSelected(0);
			expect(scope.things[0].selected).toBeTruthy();
		});
		it('should update the selectedItemsString when an item is selected', function() {
			expect(isolated.selectedItemsString).toBe('All');
			scope.things[0].selected = true;
			isolated.selectedItems();
			expect(isolated.selectedItemsString).toBe('Thing 1');
			scope.things[1].selected = true;
			isolated.selectedItems();
			expect(isolated.selectedItemsString).toBe('Thing 1, Thing 2');
			scope.things[0].selected = false;
			scope.things[1].selected = false;
			isolated.selectedItems();
			expect(isolated.selectedItemsString).toBe('All');
		});
	});

	/**
	 * Tests the soMultiselect directive.
	 */
	describe('soMultiselect Directive', function() {
		var $compile, $rootScope, $document, element;

		beforeEach(module('so.multiselect'));

		beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$document = _$document_;

			$rootScope.things = [{
				key: 't1',
				name: 'Thing 1'
			}, {
				key: 't2',
				name: 'Thing 2'
			}, {
				key: 't3',
				name: 'Thing 3'
			}];

			$rootScope.items = [];

			$rootScope.onThingsSelected = function(selectedItem) {
				$rootScope.items = selectedItem;
			};
		}));

		var clickDropdownToggle = function(elm) {
			elm = elm || element;
			elm.find('button').click();
		};

		var triggerKeyDown = function (element, keyCode) {
			var e = $.Event('keydown');
			e.which = keyCode;
			element.trigger(e);
		};

		var isFocused = function(elm) {
			return elm[0] === document.activeElement;
		};

		describe('Basic Setup', function() {
			function dropdown() {
				return $compile('<div so-multiselect items="things" name="Thing" on-selected="onThingsSelected(selectedItems)" button-class="btn-grey"></div>')($rootScope);
			}

			beforeEach(function() {
				element = dropdown();
				$rootScope.$digest();
			});

			it('should toggle on `button` click', function() {
				expect(element.hasClass('open')).toBe(false);
				clickDropdownToggle();
				expect(element.hasClass('open')).toBe(true);
				clickDropdownToggle();
				expect(element.hasClass('open')).toBe(false);
			});
			it('should remain open when an option is clicked', function() {
				$document.find('body').append(element);
				expect(element.hasClass('open')).toBe(false);
				clickDropdownToggle();
				expect(element.hasClass('open')).toBe(true);

				var optionEl = element.find('ul > li').eq(0);
				optionEl.click();
				expect(element.hasClass('open')).toBe(true);
				element.remove();
			});
			it('should close on document click', function() {
				clickDropdownToggle();
				expect(element.hasClass('open')).toBe(true);
				$document.click();
				expect(element.hasClass('open')).toBe(false);
			});
			it('should close on escape key & focus toggle element', function() {
				$document.find('body').append(element);
				clickDropdownToggle();
				triggerKeyDown($document, 27);
				expect(element.hasClass('open')).toBe(false);
				expect(isFocused(element.find('button'))).toBe(true);
				element.remove();
			});
			it('should not close on backspace key', function() {
				clickDropdownToggle();
				triggerKeyDown($document, 8);
				expect(element.hasClass('open')).toBe(true);
			});
			it('should only allow one dropdown to be open at once', function() {
				var elm1 = dropdown();
				var elm2 = dropdown();
				$rootScope.$digest();
				
				expect(elm1.hasClass('open')).toBe(false);
				expect(elm2.hasClass('open')).toBe(false);

				clickDropdownToggle( elm1 );
				expect(elm1.hasClass('open')).toBe(true);
				expect(elm2.hasClass('open')).toBe(false);

				clickDropdownToggle( elm2 );
				expect(elm1.hasClass('open')).toBe(false);
				expect(elm2.hasClass('open')).toBe(true);
			});
			it('should unbind events on scope destroy', function() {
				$rootScope.$digest();

				var buttonEl = element.find('button');
				buttonEl.click();
				expect(element.hasClass('open')).toBe(true);
				buttonEl.click();
				expect(element.hasClass('open')).toBe(false);

				$rootScope.$destroy();
				buttonEl.click();
				expect(element.hasClass('open')).toBe(false);
			});
			it('executes other document click events normally', function() {
				var checkboxEl = $compile('<input type="checkbox" ng-click="clicked = true" />')($rootScope);
				$rootScope.$digest();

				expect(element.hasClass('open')).toBe(false);
				expect($rootScope.clicked).toBeFalsy();

				clickDropdownToggle();
				expect(element.hasClass('open')).toBe(true);
				expect($rootScope.clicked).toBeFalsy();

				checkboxEl.click();
				expect($rootScope.clicked).toBeTruthy();
			});
		});
	});

	// Any actions that needs to be done after ALL of the tests (occurs for each test)
	afterEach(function() {
	});
});




