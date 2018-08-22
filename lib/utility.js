import fs from 'fs-extra';
import path from 'path';

/**
 * Fetches file path
 *
 * @param {string} directoryName - Directory/folder name where resource is located
 * @param {string} fileName - Resource (e.g. pic.png) name
 */
export async function getFilePath(directoryName, fileName) {
	//let fileBase = __dirname + '/../../..';
	let rootDirectory = process.cwd();
	let dataDirectory = path.resolve(rootDirectory, directoryName);
	let filePath = path.resolve(dataDirectory, fileName);

	if (!fs.existsSync(dataDirectory)) {
		throw new Error('File does not exist!');
	}

	return filePath;
}