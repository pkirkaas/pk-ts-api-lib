/**
 * Not sure how to best do this - but trying to test various API configs - have to eventually include nestjs
 */


import {
	 runCli, typeOf, jsonClone, cwd,
} from 'pk-ts-node-lib';

import {
	getApp, getPort, initApp, getStaticPath,
} from '../index.js';


let tstFncs = {
	async default() {
		console.log(`In API test.ts`);
	},

	async getPort() {
		let aport = getPort();
		console.log(`aport: [${aport}]`);
	},

	async tstSP() {
		let res = {
			falseP: getStaticPath(false),
			trueP: getStaticPath(true),
			emptyP: getStaticPath(),
      relP: getStaticPath('./tmp'),
      abbP: getStaticPath('/tmp'),
			cwd,
		}
		console.log({ res });
	},

	async tstApi() {
		console.log(`In API test.ts`);
		let app = await initApp();
		/*
		app.get('/test', async (req, res) => {
			return { this: "worked" };
		);
		app.listen();
		*/
	},


};

runCli(tstFncs);
