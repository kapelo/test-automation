import {
	By
} from "selenium-webdriver";

/**
 * Gets the application toast message locator that is displayed on virtually every page
 *
 * @returns {object} toast message locator
 */
export function getToastWidgetSelector() {
	return By.css("#toast-container > div > div > div > div");
}

/**
 * Gets the application yes button locator that is displayed on virtually every page
 *
 * @returns {object} yes button locator
 */
export function getModalYesButtonSelector() {
	return By.css("body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div > div.modal-footer.ng-scope > button.btn.btn-primary.ng-binding");
}

/**
 * Gets the application yes button locator that is displayed on virtually every page
 *
 * @returns {object} campaigns menu link locator
 */
export function getCampaignsMenuLinkSelector() {
	return By.css("body > section > div.sidebar-left.ng-scope > div.sidebar-left-info.ng-scope > ul > li:nth-child(2) > a > span");
}