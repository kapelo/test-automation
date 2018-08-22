import config from 'config';

/**
 * Logs a message to console
 *
 * @param {webdriver} driver - Browser context
 * @param {string} message - Text describing message to be logged to console
 */
export async function logToConsole(driver, message) {
	if (config.has('logMessageToConsole') && config.get('logMessageToConsole')) {
		await driver.wait(() => {
			console.log(message);

			return true;
		}, 5000);
	}
}