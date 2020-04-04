export interface IProcess {
	pid: number;
	name: string;
	mem: number;
}

export interface IDrive {
	path: string;
	free: number;
	size: number;
	used: number;
	name: string;
	serial: string;
}

export interface IData {
	hash: string;
	uptime: number;
	memory: {
		free: number;
		total: number;
	};
	user: {
		hostname: string;
		username: string;
	};
	OS: {
		name: string;
		platform: string;
		ver: string;
		arch: string;
	};
	ip: {
		internal: string[];
		external: string;
	};
	processes: IProcess[];
	drives: IDrive[];
}

export interface IPlatform {
	getProcesses: () => Promise<IProcess[]>;
	getDrives: () => Promise<IDrive[]>;
	getNetworks: () => Promise<string[]>;
}

export interface IPlatforms {
	[propName: string]: IPlatform;
}
