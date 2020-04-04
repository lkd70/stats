'use strict';

import * as https from 'https';

export const get = (url: string, parseJson = false): Promise<string> =>
	new Promise((resolve, reject) => {
		const req = https.get(url, res => {
			let d = '';
			res.on('error', reject);
			res.on('data', chunk => d += chunk);
			res.on('end', () => resolve(parseJson ? JSON.parse(d) : d));
		});
		req.on('error', reject);
	}
);

const deconstructURL = (URL: string) => {
	const regex =
		/^(?:([^:/?#]+):)?(?:\/\/([^/?#:]*))?(?::(\d+))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;
	const [ , protocol, host, port, path, params, id ] = URL.match(regex);
	return { protocol, host, port, path, params, id };
};

export const post = (url: string, data: any = '{}', parseJson = false): Promise<string|Object> =>
	new Promise((resolve, reject) => {
		const uri = deconstructURL(url);
		const out = typeof data === 'string' ? data : JSON.stringify(data);

		const options = {
			hostname: uri.host,
			path: uri.path || uri.path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': out.length
			}
		}

		const req = https.request(options, (res) => {
			let d = '';
			res.on('error', reject);
			res.on('data', chunk => d += chunk);
			res.on('end', () => resolve(parseJson ? JSON.parse(d) : d));
		});

		req.on("error", reject);
		req.write(out);
		req.end();
	}
);
