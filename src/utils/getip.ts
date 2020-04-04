'use strict';

import { get } from './index';

export default (): Promise<string> => get('https://api.ipify.org');
