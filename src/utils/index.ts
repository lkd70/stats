'use strict';

import getip from './getip';
import { hash, getHash } from './hash';
import { linux, win32, darwin } from './platforms';
import { getBaseDir, getSavePath, getSave, setSave } from './save';
import getStats from './stats';
import { get, post } from './http';

export {
	getip,
	hash,
	getHash,
	linux,
	win32,
	darwin,
	getBaseDir,
	getSavePath,
	getSave,
	setSave,
	getStats,
	get,
	post
};
