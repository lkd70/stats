'use strict';

import * as os from 'os';
import { exec } from 'child_process';
import { IPlatform } from '../types';

const platform: IPlatform = {
	getNetworks: () => new Promise((resolve) => {
		if ('eth0' in os.networkInterfaces()) {
			resolve(os.networkInterfaces().eth0.filter(e =>
				e.family === 'IPv4').map(e => e.address));
		} else {
			resolve([]);
		}
	}),
	getDrives: () => new Promise((resolve, reject) => {
		exec('df', (err, stdout, stderr) => {
			if (err) {
				reject({ err, stderr });
			} else {
				let drives = stdout.split('\n').slice(1).filter(d => d !== '');
				resolve(drives.map(d => {
					const regex = /(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+%)\s+(\S+)/;
					const m = d.match(regex);
					return {
						path: m[6],
						free: parseInt(m[4]),
						size: parseInt(m[2]),
						used: parseInt(m[3]),
						name: m[6],
						serial: 'Unknown',
					}
				}));
			}
		});
	}),
	getProcesses: () => new Promise((resolve, reject) => {
		exec('ps ax -o "%p|%c|%z" --no-headers', (err, stdout, stderr) => {
			if (err) {
				reject({ err, stderr });
			} else {
				const processes = stdout.replace(/ /g, '').split("\n");
				resolve(processes.filter(p => p !== '').map(p => {
					const [pid, name, mem] = p.split('|');
					return { pid: parseInt(pid), name, mem: parseInt(mem) };
				}));
			}
		});
	})
};

export default platform;
