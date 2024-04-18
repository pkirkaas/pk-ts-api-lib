/**
 * Testing initialization of API server
 */


import {
	 runCli, typeOf, jsonClone, cwd, dbgWrt, allProps,
} from 'pk-ts-node-lib';

import {
	getApi, getPort, initApi, getStaticPath, eapp, enhanceApi,
} from '../index.js';

let api = enhanceApi();;

api.get('/', async (req, res) => {
	console.log("In api root");
	res.json( { this: "root" });
});

api.get('test', async (req, res) => {
	console.log("In test");
	res.json( { this: "worked again!" });
});

//let lPort = getPort();

api.someVal = 123;
api.showVal = () => {
	//@ts-ignore 
	let asv = this.someVal;
	console.log(`in api showval:`, asv);
};


api.listenPort();
