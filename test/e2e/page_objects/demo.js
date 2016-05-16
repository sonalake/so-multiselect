'use strict';

var DemoObject = function() {
	this.multiSelectContainer = element(by.css('.multiselect-container'));
	this.multiSelectToggle = this.multiSelectContainer.element(by.css('.so-multiselect-toggle'));
	this.multiSelectToggleLabel = this.multiSelectToggle.element(by.css('.filter-label'));
	this.multiSelectToggleValue = this.multiSelectToggle.element(by.css('.filter-values'));
	this.multiSelectDropdown = this.multiSelectContainer.element(by.css('.multiselect-menu'));
	this.multiSelectDropdownOptions = this.multiSelectDropdown.all(by.css('li'));

	this.get = function() {
		browser.get('');
		browser.waitForAngular();
	};
	this.toggleDropdown = function() {
		this.multiSelectToggle.click();
		browser.waitForAngular();
	};
	this.selectDropdownOption = function(index) {
		this.multiSelectDropdownOptions.get(index).element(by.tagName('input')).click();
		browser.waitForAngular();
	};

	this.getDropdownOptionText = function(index) {
		return this.multiSelectDropdownOptions.get(index).element(by.tagName('span')).getText();
	};
	this.getDropdownOptionCheckbox = function(index) {
		return this.multiSelectDropdownOptions.get(index).element(by.tagName('input'));
	};
	this.isDropdownOptionSelected = function(index) {
		return this.multiSelectDropdownOptions.get(index).element(by.tagName('input')).isSelected();
	};
};
module.exports = DemoObject;