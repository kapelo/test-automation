import webdriver from 'selenium-webdriver';
import config from 'config';
import chrome from 'selenium-webdriver/chrome';

const webDriverImplicitWaitTimeOutMS = config.get('webDriverImplicitWaitTimeOutMS');
const webDriverPageLoadTimeOutMS = config.get('webDriverPageLoadTimeOutMS');
const browser = config.get('browser');

/**
 * Gets current screen size
 */
export function getCurrentScreenSize() {
	var screenSize = process.env.BROWSERSIZE;

	if (screenSize === undefined || screenSize === '') {
		screenSize = 'laptop';
	}

	return screenSize.toLowerCase();
}

export function getScreenSizeAsObject() {
	switch (this.getCurrentScreenSize()) {
		case 'mobile':
			return {
				width: 400,
				height: 1000
			};
		case 'tablet':
			return {
				width: 1024,
				height: 1000
			};
		case 'desktop':
			return {
				width: 1440,
				height: 1000
			};
		case 'laptop':
			return {
				width: 1366,
				height: 768
			};
		default:
			throw new Error('Unsupported screen size specified. Supported values are laptop, desktop, tablet and mobile.');
	}
}

export async function startBrowser({
	resizeBrowserWindow = true
} = {}) {
	const screenSize = this.getCurrentScreenSize();
	let selenium_server_address = 'http://' + ("localhost" || "52.214.205.71") + ':' + 4444 + '/wd/hub';
	let driver;
	let options;

	switch (browser.toLowerCase()) {
		case 'chrome':
			options = new chrome.Options();
			options.addArguments('--disable-infobars');
			//options.addArguments( '--start-maximized' );

			if (process.env.HEADLESS || (config.has('headless') && config.get('headless') === true)) {
				options.addArguments('--headless');
			}

			driver = await new webdriver.Builder().usingServer(selenium_server_address).forBrowser('chrome').setChromeOptions(options).build();

			break;
		default:
			throw new Error(`The specified browser: '${browser}' in the config is not supported. Supported browsers are 'chrome' and 'firefox'`);
	}

	const capabilities = await driver.getCapabilities();
	capabilities['map_'].set('timeouts', {
		implicit: webDriverImplicitWaitTimeOutMS,
		pageLoad: webDriverPageLoadTimeOutMS,
		script: 9000000
	});

	if (resizeBrowserWindow) {
		await this.resizeBrowser(driver, screenSize);
	}

	return driver;
}

export async function resizeBrowser(driver, screenSize) {
	if (typeof (screenSize) === 'string') {
		switch (screenSize.toLowerCase()) {
			case 'mobile':
				await driver.manage().window().setSize(400, 1000); //31st July, 2018 => setSize is deprecated. Use setRect. Doc: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Window.html
				break;
			case 'tablet':
				await driver.manage().window().setSize(1024, 1000);
				break;
			case 'desktop':
				await driver.manage().window().setSize(1440, 1000);
				break;
			case 'laptop':
				//await driver.manage().window().setSize( 1400, 790 );
				await driver.manage().window().maximize();
				break;
			default:
				throw new Error(`Unsupported screen size specified (${screenSize}). Supported values are desktop, tablet and mobile.`);
		}
	} else {
		throw new Error(`Unsupported screen size specified (${screenSize}). Supported values are desktop, tablet and mobile.`);
	}
}

export async function clearCookiesAndDeleteLocalStorage(driver) {
	await driver.manage().deleteAllCookies();
	await this.deleteLocalStorage(driver);

	return;
}

export async function deleteLocalStorage(driver) {
	const url = await driver.getCurrentUrl();

	if (url.startsWith('data:') === false && url !== 'about:blank') {
		await driver.executeScript('window.localStorage.clear();');
	}

	return;
}

/**
 * Quits the driver
 *
 * @param {webdriver} driver - Browser context
 *
 * @returns Returns the closed driver session
 */
export async function quitBrowser(driver) {
	//Sleep for 3 seconds before closing the browser to make sure all JS console errors are captured
	//await driver.sleep( 3000 );
	if (driver !== undefined) {
		await driver.quit();
	}

	return;
}