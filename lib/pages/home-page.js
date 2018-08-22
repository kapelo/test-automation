import {
	By
} from "selenium-webdriver";
import config from "config";

import BaseContainer from "../../base-container.js";
import CampaignFlow from "../../flows/set/campaign-flow.js";
import LandingPage from "./landing-page";
import * as driverHelper from "../../driver-helper.js";
import * as appComponent from "../../component/set-component.js";

let landingPage;

export default class HomePage extends BaseContainer {
	constructor(driver, visit) {
		let url = config.get("devBaseURL") + "/#!/campaigns";

		//Currently, the application does not redirect user to campaign page after logging in
		//And as a result, test fails
		//To buy pass this, we will have to forcefully redirect user to campaign page after user has successfully logged in
		//logger.logToConsole( driver, "URL => " + url );
		//driver.get( url );

		super(driver, By.css("body > section > div.body-content > div > div.header-section.ng-scope > div.notification-wrap.ng-scope > div.right-notification > ul > li:nth-child(3) > a"), "Profile menu (Homepage identifier)", visit, url);
	}

	async clickCreateNewCampaignButton() {
		const driver = this.driver;
		const createCampaignButtonSelector = By.id("split-button");

		await driverHelper.clickElement(driver, createCampaignButtonSelector, "Create New Campaign button");

		return new CampaignFlow(driver);
	}

	async clickProfileMenu() {
		const driver = this.driver;

		const profileMenuSelector = By.css("body > section > div.body-content > div > div.header-section.ng-scope > div.notification-wrap.ng-scope > div.right-notification > ul > li:nth-child(3) > a");
		await driverHelper.clickElement(driver, profileMenuSelector, "Profile Menu");
	}

	async clickLogoutButton() {
		const driver = this.driver;

		const logoutButtonSelector = By.css("body > section > div.body-content > div > div.header-section.ng-scope > div.notification-wrap.ng-scope > div.right-notification > ul > li.dropdown.open > ul > li > a");
		await driverHelper.clickElement(driver, logoutButtonSelector, "Logout button");

		landingPage = new LandingPage(driver);

		return landingPage;
	}

	async getSuccessMessage() {
		let elementText = await driverHelper.getElementText(this.driver, appComponent.getToastWidgetSelector(), "Toast message widget");

		return elementText;
	}

	async deleteCampaign() {
		const driver = this.driver;

		const deleteButtonSelector = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div:nth-child(2) > div > section > table > tbody > tr:nth-child(1) > td.space-button > div > a.btn.btn-danger.cmp-btn-txt-size.remove-radius");
		await driverHelper.clickElement(driver, deleteButtonSelector, "Delete button");

		await driverHelper.clickElement(driver, appComponent.getModalYesButtonSelector(), "Yes button");
	}

	async getTopmostCampaignStatus() {
		const statusSelector = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div:nth-child(2) > div > section > table > tbody > tr:nth-child(1) > td:nth-child(5)");

		let topmostCampaignStatus = await driverHelper.getElementText(this.driver, statusSelector, "Topmost campaign status");

		return topmostCampaignStatus;
	}
}