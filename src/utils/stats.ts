'use strict';

import * as os from 'os';
import { IData, IPlatforms } from './types';
import { getip, linux, win32, darwin, getHash } from './index';

const platforms: IPlatforms = { linux, win32, darwin };

export default () => new Promise((resolve, reject) => {
	const o: IData = {
		hash: '',
		uptime: os.uptime(),
		memory: {
			free: os.freemem(),
			total: os.totalmem()
		},
		user: {
			hostname: os.hostname(),
			username: os.userInfo().username
		},
		OS: {
			name: os.type(),
			platform: os.platform(),
			ver: os.release(),
			arch: os.arch(),
		},
		ip: {
			internal: [],
			external: ''
		},
		processes: [],
		drives: []
	};

	Promise.all([
		getHash(),
		getip(),
		platforms[os.platform()].getProcesses(),
		platforms[os.platform()].getDrives(),
		platforms[os.platform()].getNetworks(),
	]).then(res => {
		const [hash, public_ip, processes, drives, networks] = res;
		o.hash = hash;
		o.ip.external = public_ip as string;
		o.processes = processes;
		o.drives = drives;
		o.ip.internal = networks;
		resolve(o);
	}).catch(reject);
});
