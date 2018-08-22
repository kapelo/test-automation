import config from 'config';
//import * as moment from 'moment';

/**
 * Gets the account configs from the local config file.
 *
 * @param {string} account The account entry to get
 *
 * @returns {object} account Username/Password pair
 */
export function getAccountConfig(account) {
	let localConfig;

	if (config.has('testAccounts')) {
		localConfig = config.get('testAccounts');
	} else {
		//localConfig = JSON.parse( process.env.ACCOUNT_INFO );
		throw new Error(`No config set for test account`);
	}

	return localConfig[account];
}

/**
 * Gets the current date.
 *
 * @returns {object} date object.
 */
export function getCurrentDate() {
	//let currentDate = moment();

	/*console.log( 'Date: ' + currentDate.format('DD-MMMM-YYYY') );
	console.log( 'Day: ' + currentDate.date() );
	console.log( 'Month: ' + currentDate.month() );
	console.log( 'Year: ' + currentDate.year() );*/

	/*var duration = moment.duration({'days' : 1});
	moment([2012, 0, 31]).add(duration); // February 1*/

	return require('moment')();
}