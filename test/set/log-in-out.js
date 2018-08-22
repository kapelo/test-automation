import * as driverManager from '../../lib/driver-manager.js';
import * as assertManager from '../../lib/assert-manager.js';

import LoginFlow from '../../lib/flows/set/login-flow.js';

let driver, homePage;

before(async function () {
	driver = await driverManager.startBrowser();
});

after(async function () {
	driverManager.quitBrowser(driver);
});

describe(`Logging In and Out:`, function () {
	before(function () {
		driverManager.clearCookiesAndDeleteLocalStorage(driver);
	});

	describe('Cannot Log In', function () {

		it('Cannot log in with no username and no password', async function () {
			const expectedLoggedInSuccessMessage = 'Login successful';

			let loginFlow = new LoginFlow(driver);
			let loginPage = await loginFlow.loginWithNoUsernameAndNoPassword();

			let actualSuccessMessage = await loginPage.getSuccessMessage();

			await assertManager.assertNotStrictEqual(actualSuccessMessage, expectedLoggedInSuccessMessage, 'Invalid user was logged in', driver, this);
		});

		it('Cannot log in with correct username and wrong password', async function () {
			const expectedLoggedInSuccessMessage = 'Login successful';

			let loginFlow = new LoginFlow(driver);
			let loginPage = await loginFlow.loginWithCorrectUsernameAndWrongPassword();

			let actualSuccessMessage = await loginPage.getSuccessMessage();

			await assertManager.assertNotStrictEqual(actualSuccessMessage, expectedLoggedInSuccessMessage, 'Invalid user was logged in', driver, this);
		});

		it('Cannot log in with wrong username and correct password', async function () {
			const expectedLoggedInSuccessMessage = 'Login successful';

			let loginFlow = new LoginFlow(driver);
			let loginPage = await loginFlow.loginWithWrongUsernameAndCorrectPassword();

			let actualSuccessMessage = await loginPage.getSuccessMessage();

			await assertManager.assertNotStrictEqual(actualSuccessMessage, expectedLoggedInSuccessMessage, 'Invalid user was logged in', driver, this);
		});

	});

	describe('Can Log In & Out', function () {
		it('Can log in', async function () {
			const expectedSuccessMessage = 'Login successful';

			let loginFlow = new LoginFlow(driver);
			homePage = await loginFlow.loginWithCorrectUsernameAndCorrectPassword();

			let actualSuccessMessage = await homePage.getSuccessMessage();

			await assertManager.assertInclude(actualSuccessMessage, expectedSuccessMessage, 'Success message does not match', driver, this);
		});

		it('Can logout from Home page', async function () {
			await driver.sleep(4000);

			await homePage.clickProfileMenu();
			let landingPage = await homePage.clickLogoutButton();
			let isPageDisplayed = await landingPage.waitForPageToLoad();

			await assertManager.assertStrictEqual(isPageDisplayed, true, 'Page is not displayed as page identifier cannot be found', driver, this);
		});
	});
});