/* eslint-disable no-console */
'use strict';
import { exec } from 'child_process';
import { program } from 'commander';
import { existsSync, mkdirSync } from 'fs';

const commaSeporatedList = (value: string) => value.split(',');
const exit = (reason: string) => {
	console.error(reason);
	process.exit(1);
}

const debug = (msg: string) => {
	if (program.debug) console.info(msg);
}

program.version('0.0.1');
program.option('-n, --node <version>',
	'Node version in which to compile with (number or \'latest\'',
	'latest');

program.option('-s, --systems <systems>',
	'Systems to compile (comma seporated). Options: linux,win,macos,freebsd,alpine',
	commaSeporatedList,
	[ 'linux' ,'win', 'macos' ]);

program.option('-a, --archs <architectures>',
	'Architectures to compile (comma seporated). Options: x64,x86,armv6,armv7',
	commaSeporatedList,
	[ 'x64' ]);

program.option('-o, --output <output directory>',
	'Directory in which to output compiled executables',
	'./dist/build/');

program.option('-p, --prefix <file name prefix>',
	'Name of the compiled executable file',
	'stats');

program.option('-s, --source <source file location>',
	'location of the source JavaScript file to be compiled',
	'./dist/index.js');

program.option('-d, --debug', 'enables debugging output');

program.parse(process.argv);

const ALLOWED_SYSTEMS = [ 'linux', 'win', 'macos', 'freebsd', 'alpine' ];
const ALLOWED_ARCHS = [ 'x64', 'x86', 'armv6', 'armv7' ];

if (typeof program.node !== 'number' && program.node !== 'latest') exit('unknown node version');
program.systems.forEach((s: string) => !ALLOWED_SYSTEMS.includes(s)&&exit('Unsupported systems'));
program.archs.forEach((a: string) => !ALLOWED_ARCHS.includes(a)&&exit('Unsuppored architectures'));
if (!existsSync(program.output)) mkdirSync(program.output);
if (!existsSync(program.output)) exit('output directory doens\'t exist');
if (!existsSync(program.source)) exit('source file doens\'t exist');

const targets: string = program.archs.map((a: string) =>
	program.systems.map((s: string) =>
		(program.node.toString() === 'latest' ? 'latest' : `node${program.node}`)
		+ `-${s}-${a}`)).join(',');

debug('Targets: ' + targets);

const command = `node ./node_modules/pkg/lib-es5/bin.js ` +
	`${program.source} -o ${program.output}${program.prefix} -t ${targets}`

debug('Command: ' + command);

exec(command,
	(err, stdout, stderr) => {
		if (err) {
			console.error(err);
			process.exit(1);
		} else if (stderr) {
			console.error(stderr);
			process.exit(1);
		}
		console.log(`${stdout.trim()}: Compilation finished`);
});
