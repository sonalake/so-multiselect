'use strict';

describe('Sonalake Multi-Select:', function() {
		// page objects used for this test file
	var DemoPage = require('./page_objects/demo'),
		// the instantiated page object
		demo;

	beforeEach(function() {
		demo = new DemoPage();
		browser.clearMockModules();
		demo.get();
	});

	describe('Demo:', function() {
		it('should load the template correctly', function() {
			expect(demo.multiSelectContainer.isPresent()).toBeTruthy();
			expect(demo.multiSelectContainer.isDisplayed()).toBeTruthy();

			expect(demo.multiSelectToggle.isPresent()).toBeTruthy();
			expect(demo.multiSelectToggle.isDisplayed()).toBeTruthy();
			expect(demo.multiSelectToggleLabel.getText()).toBe('Thing:');
			expect(demo.multiSelectToggleValue.getText()).toBe('All');

			expect(demo.multiSelectDropdown.isPresent()).toBeTruthy();
			expect(demo.multiSelectDropdown.isDisplayed()).toBeFalsy();

			demo.toggleDropdown();

			expect(demo.multiSelectDropdown.isDisplayed()).toBeTruthy();
			expect(demo.multiSelectDropdownOptions.count()).toBe(3);
			expect(demo.getDropdownOptionText(0)).toBe('Thing 1');
			expect(demo.getDropdownOptionCheckbox(0).isPresent()).toBeTruthy();
			expect(demo.getDropdownOptionCheckbox(0).isDisplayed()).toBeTruthy();
			expect(demo.getDropdownOptionText(1)).toBe('Thing 2');
			expect(demo.getDropdownOptionCheckbox(1).isPresent()).toBeTruthy();
			expect(demo.getDropdownOptionCheckbox(1).isDisplayed()).toBeTruthy();
			expect(demo.getDropdownOptionText(2)).toBe('Thing 3');
			expect(demo.getDropdownOptionCheckbox(2).isPresent()).toBeTruthy();
			expect(demo.getDropdownOptionCheckbox(2).isDisplayed()).toBeTruthy();
		});
		it('should update the button text as items are selected', function() {
			expect(demo.multiSelectToggleLabel.getText()).toBe('Thing:');
			expect(demo.multiSelectToggleValue.getText()).toBe('All');

			demo.toggleDropdown();

			// first check that nothing has been selected yet
			expect(demo.getDropdownOptionText(0)).toBe('Thing 1');
			expect(demo.isDropdownOptionSelected(0)).toBeFalsy();
			expect(demo.getDropdownOptionText(1)).toBe('Thing 2');
			expect(demo.isDropdownOptionSelected(1)).toBeFalsy();
			expect(demo.getDropdownOptionText(2)).toBe('Thing 3');
			expect(demo.isDropdownOptionSelected(2)).toBeFalsy();

			// select the first option
			demo.selectDropdownOption(0);
			expect(demo.isDropdownOptionSelected(0)).toBeTruthy();
			expect(demo.multiSelectToggleValue.getText()).toBe('Thing 1');

			// select the last option
			demo.selectDropdownOption(2);
			expect(demo.isDropdownOptionSelected(2)).toBeTruthy();
			expect(demo.multiSelectToggleValue.getText()).toBe('Thing 1, Thing 3');

			// select the middle option
			demo.selectDropdownOption(1);
			expect(demo.isDropdownOptionSelected(1)).toBeTruthy();
			expect(demo.multiSelectToggleValue.getText()).toBe('Thing 1, Thing 2, Thing 3');
		});
	});
});