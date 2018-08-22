import {
	By
} from "selenium-webdriver";
import config from "config";

import BaseContainer from "../../base-container.js";

import * as driverHelper from "../../driver-helper.js";
import * as appComponent from "../../component/set-component.js";

export default class LoginPage extends BaseContainer {
	constructor(driver, visit, overrideURL) {
		let loginURL = LoginPage.getLoginURL();

		if (typeof overrideURL === "string") {
			loginURL = overrideURL;
		}

		super(
			driver,
			By.css("body > section > div:nth-child(2) > div > div:nth-child(3) > div > div > form > div:nth-child(1) > input"), "Username button (Login page identifier)", visit, loginURL);
	}

	async login(username, password) {
		const driver = this.driver;

		const usernameSelector = By.css("body > section > div:nth-child(2) > div > div:nth-child(3) > div > div > form > div:nth-child(1) > input");
		const passwordSelector = By.css("body > section > div:nth-child(2) > div > div:nth-child(3) > div > div > form > div:nth-child(3) > input");
		const loginButtonSelector = By.css("body > section > div:nth-child(2) > div > div:nth-child(3) > div > div > form > div:nth-child(5) > button");

		await driverHelper.setText(driver, usernameSelector, username, "Username", true);
		await driverHelper.setText(driver, passwordSelector, password, "Password", true);
		await driverHelper.clickElement(driver, loginButtonSelector, "Login button");
	}

	static getLoginURL() {
		const baseURL = config.get("devBaseURL");
		let loginURL = `${baseURL}/#!/login`;

		return loginURL;
	}

	async getSuccessMessage() {
		const elementText = await driverHelper.getElementText(this.driver, appComponent.getToastWidgetSelector(), "Toast message widget");

		return elementText;
	}
}