'use strict';

import { getSave, setSave } from './save';

export const hash = (format = 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx') => format.replace(/[xy]/g,
	char => {
			const rand = (new Date().getMilliseconds() + Math.random() * 16) % 16 | 0;
			return (char === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
});

export const getHash = (format = 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'): Promise<string> =>
	new Promise((resolve, reject) => {
		getSave().then((save: any) => {
			if ('uuid' in save) {
				resolve(save.uuid as string);
			} else {
				save.uuid = hash(format);
				setSave(save).then(() => resolve(save.uuid)).catch(reject);
			}
		})
});
