import webdriver from 'selenium-webdriver';
import {
	until
} from 'selenium-webdriver';
import config from 'config';

import * as logger from './logger.js';

const EXPLICIT_WAIT_MS = config.get('explicitWaitMS');
const RETRY_WAIT_TIME_MS = 250;
const RETRY_ATTEMPT = 10;

/**
 * Waits for an element to be present in the DOM
 * Throws an error if element is not found within the specified wait time but returns element the moment it is found not withstanding whether the wait time has elasped
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element to be searched for
 * @param {string} label - Text describing element being searched in the DOM. In the event that this element is not found, this parameter will be included in the test report e.g. 'Save button'
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
async function waitForElementToBeLocated(driver, locator, label, retries = RETRY_ATTEMPT) {
	try {
		await driver.wait(until.elementLocated(locator), EXPLICIT_WAIT_MS);
		const webElement = await driver.findElement(locator);
		return webElement;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Unable to locate element "${label}" after ${RETRY_ATTEMPT} retries.`);
		}

		//Wait a few milliseconds for element to be added to DOM before trying again
		await driver.sleep(RETRY_WAIT_TIME_MS);

		return waitForElementToBeLocated(driver, locator, label, retries - 1);
	}
}

/**
 * Waits for an element to be visible in the DOM
 * Throws an error if element is not visible within the specified wait time but returns element the moment it is found not withstanding whether the wait time has elasped
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element to be searched for
 * @param {string} label - Text describing element being searched in the DOM. In the event that this element is not found, this parameter will be included in the test report e.g. 'Save button'
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
async function waitForElementToBeVisible(driver, locator, label, retries = RETRY_ATTEMPT) {
	try {
		const webElement = await driver.findElement(locator);
		await driver.wait(until.elementIsVisible(webElement), EXPLICIT_WAIT_MS);
		return webElement;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Element "${label}" still not visible after ${RETRY_ATTEMPT} retries.`);
		}

		await driver.sleep(RETRY_WAIT_TIME_MS);

		return waitForElementToBeVisible(driver, locator, label, retries - 1);
	}
}

/**
 * Waits for an element to be present in the DOM and visible
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element to be searched for
 * @param {string} label - Text describing element being searched in the DOM. In the event that this element is not found, this parameter will be included in the test report e.g. 'Save button'
 *
 * @returns Returns the web element
 */
export async function waitTillElementIsPresentAndDisplayed(driver, locator, label) {
	await waitForElementToBeLocated(driver, locator, label);
	await waitForElementToBeVisible(driver, locator, label);

	return driver.findElement(locator);
}

/**
 * Fetches the child elements of a parent element
 * Throws an error if child elements cannot be found in the DOM
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the parent element
 * @param {locator} elementsLocator - The locator representing the child element(s) to be searched for
 * @param {string} label - Text describing parent element being searched in the DOM. In the event that this element is not found, this parameter will be included in the test report e.g. 'Save button'
 * 
 * @returns Returns the child web elements of a parent element
 */
export async function getElements(driver, locator, elementsLocator, label) {
	const webElement = await waitTillElementIsPresentAndDisplayed(driver, locator, label);

	let webElements;

	try {
		webElements = await webElement.findElements(elementsLocator);
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Unable to get "${label}" elements.`);
		}
	}

	return webElements;
}

/**
 * Clicks an element
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element to be clicked
 * @param {string} label - Text describing element being clicked on
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
export async function clickElement(driver, locator, label, retries = RETRY_ATTEMPT) {
	const webElement = await waitTillElementIsPresentAndDisplayed(driver, locator, label);

	try {
		await webElement.click();
		await logger.logToConsole(driver, `\t'${label}' clicked`);

		return;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Still not able to click "${label}" after ${RETRY_ATTEMPT} retries.`);
			//throw new Error( `Still not able to click ${label} after ${RETRY_ATTEMPT} retries. \nError message: ${err.message.toString()}` );
		}

		await driver.sleep(RETRY_WAIT_TIME_MS);

		return clickElement(driver, locator, label, retries - 1);
	}
}

/**
 * Enters text into an input field
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element text will be entered into
 * @param {string} label - Text describing element text is being entered into
 * @param {boolean} secureValue - Boolean value determing whether to reveal text in log file
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
export async function setText(driver, locator, value, label, secureValue, retries = RETRY_ATTEMPT) {
	const logValue = secureValue === true ? '*********' : value;

	const webElement = await waitTillElementIsPresentAndDisplayed(driver, locator, label);

	await webElement.click();
	await webElement.clear();

	try {
		await webElement.sendKeys(value);
		await logger.logToConsole(driver, `\t'${logValue}' entered into '${label}' field`);

		return;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Unable to send '${logValue}' to "${label}" after ${RETRY_ATTEMPT} retries.`);
		}

		await driver.sleep(RETRY_WAIT_TIME_MS);

		return setText(driver, locator, value, label, retries - 1);
	}
}

/**
 * Enters text into an input field
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element text will be entered into
 * @param {string} label - Text describing element text is being entered into
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
export async function sendKeys(driver, locator, value, label, retries = RETRY_ATTEMPT) {
	const webElement = await waitTillElementIsPresentAndDisplayed(driver, locator, label);

	try {
		await webElement.sendKeys(value);
		await logger.logToConsole(driver, `Text entered into '${label}' field`);

		return;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Unable to send '${logValue}' to "${label}" after ${RETRY_ATTEMPT} retries.`);
		}

		await driver.sleep(RETRY_WAIT_TIME_MS);

		return sendKeys(driver, locator, value, label, retries - 1);
	}
}

/**
 * Fetches the text value of an element
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} locator - The locator representing the element whose text will be fetched
 * @param {string} label - Text describing element text is being entered into
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
export async function getElementText(driver, locator, label, retries = RETRY_ATTEMPT) {
	const webElement = await waitTillElementIsPresentAndDisplayed(driver, locator, label);

	try {
		const elementText = await webElement.getText();

		return elementText;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Unable to get "${label}" text after ${RETRY_ATTEMPT} retries.`);
		}

		await driver.sleep(RETRY_WAIT_TIME_MS);

		return getElementText(driver, locator, label, retries - 1);
	}
}

/**
 * Drags element to a different location on the page
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {locator} draggableElementLocator - The locator representing the element to be dragged
 * @param {string} droppableElementLocator - The locator representing the element at which other element will be dropped
 * @param {int} retries - Number of times function should be recalled in the event that element was not found
 */
export async function dragAndDrop(driver, draggableElementLocator, droppableElementLocator, retries = RETRY_ATTEMPT) {
	let draggableWebElement = await waitTillElementIsPresentAndDisplayed(driver, draggableElementLocator);
	let droppableWebElement = await waitTillElementIsPresentAndDisplayed(driver, droppableElementLocator);

	try {
		await driver.actions({
			bridge: true
		}).dragAndDrop(draggableWebElement, droppableWebElement).perform();

		return true;
	} catch (err) {

		if (retries === 0) {
			throw new Error(`Unable to drag & drop element after ${RETRY_ATTEMPT} retries.`);
		}

		await driver.sleep(RETRY_WAIT_TIME_MS);

		return dragAndDrop(driver, draggableElementLocator, droppableElementLocator, retries - 1);
	}
}

/**
 * Scrolls to the topmost part of the page
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 */
export async function scrollToTop(driver) {
	let script = 'window.scrollTo(0,-Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight))';
	await driver.executeScript(script);

	return;
}

/**
 * Scrolls to the part of the page represented by the co-ordinate
 *
 * @param {webdriver} driver - Browser context in which to search DOM
 * @param {int} horizontalCoordinate - Horizontal co-ordinate to navigate to
 * @param {int} verticalCoordinate - Vertical co-ordinate to navigate to
 */
export async function scrollTo(driver, horizontalCoordinate, verticalCoordinate) {
	let script = "window.scrollTo('" + horizontalCoordinate + "','" + verticalCoordinate + "')";
	//await driver.executeScript( script );

	return await driver.executeScript(script);;
}

/**
 * Check whether an image is actually visible - that is rendered to the screen - not just having a reference in the DOM
 * @param {webdriver} driver - Browser context in which to search
 * @param {WebElement} webElement - Element to search for
 * @returns {Promise} - Resolved when the script is done executing
 */
export async function isImageVisible(driver, webElement) {
	return await driver.executeScript('return (typeof arguments[0].naturalWidth != \"undefined\" && arguments[0].naturalWidth > 0)', webElement);
}

/**
 * Style the DOM element of a webpage
 * @param {webdriver} driver - Browser context in which to search
 * @param {WebElement} webElement - Element to search for
 * @returns {Promise} - Resolved when the script is done executing
 */
export async function styleElement(driver) {
	return await driver.executeScript('document.getElementById("xlsxUploader").style.display = "block"');

	/*let webElement = await waitForElementToBeLocated(driver, locator, label);
	await driver.executeScript(await setStyle(webElement, style));*/
}

/* async function setStyle(webElement, cssStyle) {
	await webElement.setAttribute("style", cssStyle);
	console.log('Attribute set!!!');

	return true;
} */