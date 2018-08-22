import * as driverManager from '../../lib/driver-manager.js';
import * as assertManager from '../../lib/assert-manager.js';

import LoginFlow from '../../lib/flows/set/login-flow.js';

let driver, homePage, campaignPage;

before(async function () {
	driver = await driverManager.startBrowser();
});

after(async function () {
	driverManager.quitBrowser(driver);
});

describe(`Manage Campaign:`, function () {
	before(function () {
		driverManager.clearCookiesAndDeleteLocalStorage(driver);
	});

	describe('Create campaign', function () {
		it('Can create campaign', async function () {
			const expectedSuccessMessage = 'New campaign created';

			let loginFlow = new LoginFlow(driver);
			let homePage = await loginFlow.loginWithCorrectUsernameAndCorrectPassword();

			await driver.sleep(3500);

			let campaignFlow = await homePage.clickCreateNewCampaignButton();
			campaignPage = await campaignFlow.createCampaign();

			let actualSuccessMessage = await campaignPage.getSuccessMessage();

			await assertManager.assertInclude(actualSuccessMessage, expectedSuccessMessage, 'Success message does not match', driver, this);
		});

		it('Can stop campaign', async function () {
			const expectedSuccessMessage = 'Campaign Completed';

			await driver.sleep(3500);
			campaignPage.stopCampaign();

			let actualSuccessMessage = await campaignPage.getSuccessMessage();

			await assertManager.assertInclude(actualSuccessMessage, expectedSuccessMessage, 'Success message does not match', driver, this);
		});
	});
});