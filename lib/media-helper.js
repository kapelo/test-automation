import fs from 'fs-extra';
import path from 'path';
import webdriver from 'selenium-webdriver';

import * as logger from './logger.js';

/**
 * Takes screenshot
 *
 * @param {webdriver} driver - Browser context
 */
export async function takeScreenshot(driver) {
	let screenshotImage;

	try {
		screenshotImage = await driver.takeScreenshot();
	} catch (err) {
		throw new Error(`Unable to take screenshot. ${err.message.toString()}`);
	}

	return screenshotImage;
}

/**
 * Saves image to file
 *
 * @param {string} directoryName - Directory/folder name to save image in
 * @param {imageObject} image - Screenshot image
 * @param {string} prefix - Image name
 */
export async function saveImageToFile(directoryName, image, prefix) {
	let screenShotBase = __dirname + '/..';

	let logDirectory = path.resolve(screenShotBase, directoryName);

	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory);
	}

	let dateString = new Date().getTime().toString();
	let fileName = `${dateString}-${prefix}.png`;
	let logPath = `${logDirectory}/${fileName}`;

	await fs.writeFileSync(logPath, image, 'base64', (err) => {
		if (err) {
			throw new Error(`Unable to save image. ${err.message.toString()}`);
		} else {
			logger.logToConsole(driver, 'Image saved!');
		}
	});

	return logPath;
}