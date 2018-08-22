import {
	By
} from "selenium-webdriver";
import config from "config";

import BaseContainer from "../../base-container.js";
import * as driverHelper from "../../driver-helper.js";
import CampaignPage from "./campaign-page.js";
import * as appComponent from "../../component/set-component.js";

export default class CreateCampaignPage extends BaseContainer {
	constructor(driver, visit, overrideURL) {
		let loginURL = CreateCampaignPage.getURL();

		if (typeof overrideURL === "string") {
			loginURL = overrideURL;
		}

		super(driver, By.id("name"), "Campaign name label (Create Campaign page identifier)", visit, loginURL);
	}

	async createCampaign(startDate, numOfDays) {
		const driver = this.driver;

		const startDateSelector = By.id("startDate");
		const numOfDaysSelector = By.id("duration");
		const saveButtonSelector = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div > div > div > div > form > div:nth-child(7) > div > button.btn.btn-warning.cmp-btn-txt-size.remove-radius");

		await driverHelper.clickElement(driver, startDateSelector, "Start Date");
		await this.selectDate(driver, startDate);
		await driverHelper.setText(driver, numOfDaysSelector, numOfDays, "Days");
		await driverHelper.clickElement(driver, saveButtonSelector, "Save button");
		await driverHelper.clickElement(driver, appComponent.getModalYesButtonSelector(), "Yes button");

		let campaignPage = new CampaignPage(this.driver);
		await campaignPage.waitForPageToLoad();

		return campaignPage;
	}

	async selectDate(driver, date) {
		const dateWidgetSelector = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div > div > div > div > form > div:nth-child(2) > div > p.input-group > div > ul > li:nth-child(1) > div > div > div > table > tbody");
		const dateElementsSelector = By.tagName("td");
		const nextMonthSelector = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div > div > div > div > form > div:nth-child(2) > div > p.input-group > div > ul > li:nth-child(1) > div > div > div > table > thead > tr:nth-child(1) > th:nth-child(3) > button > i");
        //To Do: Refactor generated xpath to be less likely to break
		const monthTitleSelector = By.xpath("html/body/section/div/div/div/div/div/div/div/form/div/div/p/div/ul/li/div/div/div/table/thead/tr/th/button/strong");

		let monthTitle = await driverHelper.getElementText(driver, monthTitleSelector, "Month title header");
		let month = monthTitle.split(" ");

		if (this.getMonthName(date.get("month")) !== month[0]) {
			await driverHelper.clickElement(driver, nextMonthSelector, "Next month button");
		}

		const webElements = await driverHelper.getElements(driver, dateWidgetSelector, dateElementsSelector);

		for (let index = 0; index < webElements.length; index++) {
			let cellElement = webElements[index];
			let cellClassAttribute = await cellElement.getAttribute("class");

			if (cellClassAttribute !== "text-center h6 ng-scope") {
				let cellText = await cellElement.getText();

				if (cellText === this.getDate(date.get("date"))) {
					await cellElement.click();

					break;
				}
			} else {
				continue;
			}
		}
	}

	getDate(date) {
		if (parseInt(date) / 10 < 1) {
			return "0" + date;
		} else {
			return date + "";
		}
	}

	getMonthName(monthIndex) {
		switch (monthIndex) {
			case 0:
				return "January";
			case 1:
				return "February";
			case 2:
				return "March";
			case 3:
				return "April";
			case 4:
				return "May";
			case 5:
				return "June";
			case 6:
				return "July";
			case 7:
				return "August";
			case 8:
				return "September";
			case 9:
				return "October";
			case 10:
				return "November";
			case 11:
				return "December";
			default:
				throw new Error(`Invalid month.`);
		}
	}

	static getURL() {
		const baseURL = config.get("devBaseURL");
		let campaignsPageURL = `${baseURL}/#!/campaigns/new`;

		return campaignsPageURL;
	}
}