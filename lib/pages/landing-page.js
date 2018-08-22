import {
	By
} from "selenium-webdriver";
import config from "config";

import BaseContainer from "../../base-container.js";

import * as driverHelper from "../../driver-helper.js";

export default class LandingPage extends BaseContainer {
	constructor(driver, visit, overrideURL) {
		let loginURL = LandingPage.getLoginURL();

		if (typeof overrideURL === "string") {
			loginURL = overrideURL;
		}

		super(driver, By.css("body > section > div:nth-child(2) > div > div.ng-scope.white-wrapper > section > div > div > div.intro-message > div > div.col-xs-12.col-sm-9 > h3"), "Heading (Landing page identifier)", visit, loginURL);
	}

	async clickLoginButton() {
		const driver = this.driver;

		const logoutButtonSelector = By.css("body > section > div:nth-child(2) > div > div.ng-scope.white-wrapper > section > div > div > div.intro-message > div > div.col-xs-12.col-sm-9 > div > div:nth-child(2) > a");

		await driverHelper.clickElement(driver, logoutButtonSelector, "Login button on Landing page");
	}

	static getLoginURL() {
		const baseURL = config.get("devBaseURL");
		let loginPageURL = `${baseURL}`;

		return loginPageURL;
	}
}