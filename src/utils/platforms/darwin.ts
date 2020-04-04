'use strict';

interface IPlatform {
	getProcesses: () => Promise<any>;
	getDrives: () => Promise<any>;
	getNetworks: () => Promise<any>;
}

const platform: IPlatform = {
	getNetworks: () => new Promise((_resolve, reject) => {
		reject('Not implemented on MAC yet!');
	}),
	getDrives: () => new Promise((_resolve, reject) => {
		reject('Not implemented on MAC yet!');
	}),
	getProcesses: () => new Promise((_resolve, reject) => {
		reject('Not implemented on Mac yet!');
	})
}

export default platform;
