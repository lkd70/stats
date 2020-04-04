'use strict';

import * as os from 'os';
import { exec } from 'child_process';
import { IPlatform } from '../types';

const platform: IPlatform = {
	getNetworks: () => new Promise((resolve) => {
		if ('Ethernet' in os.networkInterfaces()) {
			resolve(os.networkInterfaces().Ethernet.filter(e =>
				e.family === 'IPv4').map(e => e.address));
		} else {
			resolve([]);
		}
	}),
	getProcesses: () => new Promise((resolve, reject) => {
		exec('tasklist', (err, stdout, stderr) => {
			if (err) {
				reject({ err, stderr });
			} else {
				const processes = stdout.trim().split("\n").slice(2);
				resolve(processes.map(p => {
					const m = p.match(/(\S+)\s+(\d+)\s+(\w+)\s+(\d+)\s+(\d{1,3}(,\d{3})*)\s+K/);
					return { name: m[1],
						pid: parseInt(m[2]),
						mem: parseInt(m[5].replace(',', ''))
					};
				}));
			}
		});
	}),
	getDrives: () => new Promise((resolve, reject) => {
		exec('wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,VolumeName /format:csv',
			(err, stdout, stderr) => {
				if (err) {
					reject({ err, stderr });
				} else {
					const rows = stdout.split('\r\r\n').slice(1).slice(1, -1);
					resolve(rows.map(row => {
						const r = row.split(',');
						return {
							path: r[1],
							free: parseInt(r[2]),
							size: parseInt(r[3]),
							used: parseInt(r[3]) - parseInt(r[2]),
							name: r[4],
							serial: r[5]
						};
					}));
				}
			});
	})
}

export default platform;
