'use strict';

import { getStats } from './utils';
import { post } from './utils/http';

interface IStatsResponse {
	error: boolean;
	message: String;
	hash: String;
}

const updateStats = () => getStats().then(data => {
	post('https://stats.lkd70.io/api/v1/update', data, true).then((res: IStatsResponse) => {
		if (res.error) {
			console.error(res.message);
		}
	}).catch(console.error);
});

updateStats();
setInterval(updateStats, 60000);
