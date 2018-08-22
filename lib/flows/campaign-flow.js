import CreateCampaignPage from "../../pages/set/create-campaign-page.js";

import * as dataHelper from "../../data-helper.js";

let createCampaignPage;

export default class CampaignFlow {
	constructor(driver) {
		this.driver = driver;
	}

	async createCampaign() {
		let currentDate = dataHelper.getCurrentDate();
		let startDate = currentDate.add({
			days: 1
		});

		createCampaignPage = new CreateCampaignPage(this.driver);
		await createCampaignPage.waitForPageToLoad();

		let campaignPage = await createCampaignPage.createCampaign(startDate, 4);

		return campaignPage;
	}
}