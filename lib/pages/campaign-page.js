import {
	By
} from "selenium-webdriver";
import config from "config";

import BaseContainer from "../../base-container.js";
import * as driverHelper from "../../driver-helper.js";
import * as utility from "../../utility.js";
import * as appComponent from "../../component/set-component.js";
import HomePage from "./home-page";

let homePage;
const BULK_UPLOAD_BUTTON_SELECTOR = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab-content.ng-scope > div.row.panel-top-most.ng-scope > div.col-sm-6.text-right.pd-top-15 > a.pale-button.pull-right.mg-right-5.ng-scope");
const SAVE_BUTTON_SELECTOR = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab-content.ng-scope > div.row.panel-top-most.ng-scope > div:nth-child(1) > button.green-button.mg-left-5");

export default class CampaignPage extends BaseContainer {
	constructor(driver, visit, overrideURL) {
		let loginURL = CampaignPage.getURL();

		if (typeof overrideURL === "string") {
			loginURL = overrideURL;
		}

		super(driver, By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-bottom-20.ng-scope > div > a.green-button"), "Stop campaign button (Campaign details page identifier)", visit, loginURL);
	}

	async uploadTeamInformation() {
		const DRIVER = this.driver;
		const HIDDEN_FILE_PLACEHOLDER_SELECTOR = By.id("xlsxUploader");

		await driverHelper.clickElement(DRIVER, BULK_UPLOAD_BUTTON_SELECTOR, 'Bulk Upload button');
		await DRIVER.executeScript('document.getElementById("xlsxUploader").style.display = "block"');

		let filePath = await utility.getFilePath('data', 'TeamInformation.xlsx');
		await driverHelper.sendKeys(DRIVER, HIDDEN_FILE_PLACEHOLDER_SELECTOR, filePath, 'File placeholder');
		await driverHelper.clickElement(DRIVER, SAVE_BUTTON_SELECTOR, "Save button");
		await driverHelper.clickElement(DRIVER, appComponent.getModalYesButtonSelector(), "Yes button");
	}

	async getNumberOfTeams() {
        //To Do: Refactor generated xpath to be less likely to break
		const NO_OF_UPLOADED_TEAMS_LABEL = By.xpath('/html/body/section/div[2]/div/div[3]/div[4]/section/div[2]/div[3]/div[1]/text()');

		await driverHelper.scrollTo(this.driver, 0, 250);
		await this.driver.sleep(30000);
		let elementText = await driverHelper.getElementText(this.driver, NO_OF_UPLOADED_TEAMS_LABEL, "No of uploaded teams label");

		return elementText;
	}

	async assignSupervisorsToTeams() {
		const DRIVER = this.driver;
		const SAVE_BUTTON_SELECTOR = By.css('body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab-content.ng-scope > div.row.panel-top-most.ng-scope > div.col-sm-6.text-right.pd-top-15 > button.green-button.pull-right > i');
		let supervisorOne = By.css('body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab-content.ng-scope > div.row.mg-top-10.ng-scope > div > section > div.row.assign-team.mg-left-0.mg-right-0 > table > tbody > tr > td.fixedwidth.cagetd > div > div:nth-child(2) > table > tbody > tr:nth-child(1) > td > div > div > span > strong');
		let dayOne = By.css('#mCSB_2_container > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > ol > p');
		//let dayTwo = By.css('#mCSB_2_container > table > tbody > tr:nth-child(1) > td:nth-child(5) > div > ol > p');

		await driverHelper.scrollTo(this.driver, 0, 350);
		await driverHelper.dragAndDrop(DRIVER, supervisorOne, dayOne);
		//await driverHelper.dragAndDrop(DRIVER, supervisorOne, dayTwo);
		await driverHelper.clickElement(DRIVER, SAVE_BUTTON_SELECTOR, "Save button");
		await driverHelper.clickElement(DRIVER, appComponent.getModalYesButtonSelector(), "Yes button");
	}

	async clickBackButton() {
		const BACK_BUTTON = By.css('body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab-content.ng-scope > div.row.panel-top-most.ng-scope > div:nth-child(1) > button.blue-button');

		await driverHelper.clickElement(this.driver, BACK_BUTTON, "Back button");
	}

	async navigateToSupervisorInformationTab() {
		const SUPERVISOR_INFO_TAB = By.css('body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab.ng-isolate-scope > ul > li:nth-child(2) > a');

		await driverHelper.clickElement(this.driver, SUPERVISOR_INFO_TAB, 'Supervisor Information Tab');
	}

	async navigateToTeamAssignmentTab() {
		const TEAM_ASSIGNMENT_TAB = By.css('body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-top-30.ng-scope > section > div.main-tab.ng-isolate-scope > ul > li:nth-child(3) > a');

		await driverHelper.clickElement(this.driver, TEAM_ASSIGNMENT_TAB, 'Team Assignment Tab');
	}

	async uploadSupervisorInformation() {
		const DRIVER = this.driver;
		const HIDDEN_FILE_PLACEHOLDER_SELECTOR = By.id("file-7");

		await driverHelper.clickElement(DRIVER, BULK_UPLOAD_BUTTON_SELECTOR, 'Bulk Upload button');
		await DRIVER.executeScript('document.getElementById("file-7").style.display = "block"');

		let filePath = await utility.getFilePath('data', 'SupervisorInformation.xlsx');
		await driverHelper.sendKeys(DRIVER, HIDDEN_FILE_PLACEHOLDER_SELECTOR, filePath, 'File placeholder');
		await driverHelper.clickElement(DRIVER, SAVE_BUTTON_SELECTOR, 'Save button');
		await driverHelper.clickElement(DRIVER, appComponent.getModalYesButtonSelector(), "Yes button");
	}

	async stopCampaign() {
		const driver = this.driver;
		const stopCampaignButtonSelector = By.css("body > section > div.body-content > div > div.ng-scope.wrapper > div.row.mg-bottom-20.ng-scope > div > a.green-button");

		await driverHelper.scrollToTop(driver);

		await driverHelper.clickElement(driver, stopCampaignButtonSelector, "Stop Campaign button");
		await driverHelper.clickElement(driver, appComponent.getModalYesButtonSelector(), "Yes button");
	}

	async navigateToHomepage() {
		const driver = this.driver;

		await driverHelper.clickElement(driver, appComponent.getCampaignsMenuLinkSelector(), "Campaigns menu link");

		homePage = new HomePage(driver);
		await homePage.waitForPageToLoad();

		return homePage;
	}

	async getSuccessMessage() {
		const elementText = await driverHelper.getElementText(this.driver, appComponent.getToastWidgetSelector(), "Toast message widget");

		return elementText;
	}

	static getURL() {
		const baseURL = config.get("devBaseURL");
		let campaignsPageURL = `${baseURL}/#!/campaigns/new`;

		return campaignsPageURL;
	}
}