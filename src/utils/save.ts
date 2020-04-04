'use strict';

import { writeFile, exists, readFile, mkdir } from 'fs';
import { join } from 'path';

interface ISave {
	uuid?: string;
}

export const getBaseDir = (fallback = false) => {
	const {
		HOME,
		AppData
	} = process.env;

	if (fallback === true) return __dirname;

	return typeof HOME === 'undefined'
		? typeof AppData === 'undefined' ? __dirname : AppData : HOME;
};

export const getSavePath = (app = '.statsApp'): Promise<string> =>
	new Promise((resolve, reject) => {
		let dir = getBaseDir();
		exists(dir, e => {
			if (e) {
				mkdir(join(dir, app), () => resolve(join(dir, app)));
			} else {
				dir = getBaseDir(true);
				exists(dir, r => {
					if (r) {
						mkdir(join(dir, app), () => resolve(join(dir, app)));
					} else {
						reject(new Error('Could not make or poll any home paths'));
					}
				})
			}
		});
	});

export const getSave = (file = 'save.json', path = '.statApp'): Promise<ISave> =>
	new Promise((resolve, reject) => getSavePath(path).then((dir: string) =>
		exists(join(dir, file), r => {
			if (r) {
				readFile(join(dir, file), (err, data) => {
					if (err) {
						reject('An error occurred whilst attempting to save file: ' + err);
					} else {
						resolve(JSON.parse(data.toString()));
					}
				})
			} else {
				writeFile(join(dir, file), '{}', () => {
					resolve({});
				})
			}
		})).catch(reject));

export const setSave = (data: ISave, file = 'save.json', path = '.statApp') => new Promise((resolve, reject) => {
	getSavePath(path).then((dir) => {
		writeFile(join(dir, file), JSON.stringify(data), (err) => {
			if (err) {
				reject(new Error('An error occurred whilst saving: ' + err));
			} else {
				resolve(data);
			}
		})
	})
});
