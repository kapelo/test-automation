import LandingPage from "../../pages/set/landing-page.js";
import LoginPage from "../../pages/set/login-page.js";
import HomePage from "../../pages/set/home-page.js";

import * as dataHelper from "../../data-helper";

let loginPage, landingPage, homePage, testUserName, testPassword;

export default class LoginFlow {
	constructor(driver, account) {
		this.driver = driver;

		if (account) {
			this.account = account;
		} else {
			this.account = "adminUser";
		}

		const accountInfo = dataHelper.getAccountConfig(this.account);

		if (accountInfo !== undefined) {
			testUserName = accountInfo[0];
			testPassword = accountInfo[1];
		} else {
			throw new Error(
				`Account key '${this.account}' not found in the configuration`
			);
		}
	}

	async loginWithCorrectUsernameAndCorrectPassword() {
		landingPage = new LandingPage(this.driver, true);
		await landingPage.waitForPageToLoad();
		landingPage.clickLoginButton();

		loginPage = new LoginPage(this.driver);
		await loginPage.waitForPageToLoad();
		await loginPage.login(testUserName, testPassword);

		homePage = new HomePage(this.driver);
		await homePage.waitForPageToLoad();

		return homePage;
	}

	async loginWithNoUsernameAndNoPassword() {
		testUserName = "";
		testPassword = "";

		landingPage = new LandingPage(this.driver, true);
		await landingPage.waitForPageToLoad();
		landingPage.clickLoginButton();

		loginPage = new LoginPage(this.driver);
		await loginPage.waitForPageToLoad();
		await loginPage.login(testUserName, testPassword);

		return loginPage;
	}

	async loginWithCorrectUsernameAndWrongPassword() {
		testPassword = "donteventhinkofit";

		landingPage = new LandingPage(this.driver, true);
		await landingPage.waitForPageToLoad();
		landingPage.clickLoginButton();

		loginPage = new LoginPage(this.driver);
		await loginPage.waitForPageToLoad();
		await loginPage.login(testUserName, testPassword);

		return loginPage;
	}

	async loginWithWrongUsernameAndCorrectPassword() {
		testUserName = "donteventhinkofit";

		landingPage = new LandingPage(this.driver, true);
		await landingPage.waitForPageToLoad();
		landingPage.clickLoginButton();

		loginPage = new LoginPage(this.driver);
		await loginPage.waitForPageToLoad();
		await loginPage.login(testUserName, testPassword);

		return loginPage;
	}

	async getLoginPage() {
		return loginPage;
	}
}