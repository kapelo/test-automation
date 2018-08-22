import * as driverManager from './driver-manager';
import * as driverHelper from './driver-helper';

export default class BaseContainer {
	constructor(driver, expectedElementLocator, pageIdentifierLabel, visit = false, url = null) {
		this.driver = driver;
		this.expectedElementLocator = expectedElementLocator;
		this.pageIdentifierLabel = pageIdentifierLabel;
		this.url = url;
		this.screenSize = driverManager.getCurrentScreenSize().toUpperCase();

		if (visit === true) {
			this.driver.get(this.url);
		}
	}

	/**
	 * Ensures page is loaded
	 *
	 * @returns {boolean} - Returns when the page identifier is present and displayed on page
	 */
	async waitForPageToLoad() {
		await driverHelper.waitTillElementIsPresentAndDisplayed(this.driver, this.expectedElementLocator, this.pageIdentifierLabel);

		return true;
	}

	/**
	 * Fetches the title of the page
	 *
	 * @returns {string} - Returns the page title
	 */
	async getTitle() {
		let title = await this.driver.getTitle();

		return title;
	}

	/**
	 * Fetches the url of the page
	 *
	 * @returns {url} - Returns the page url
	 */
	async getCurrentUrl() {
		let url = await this.driver.getCurrentUrl();

		return url;
	}
}