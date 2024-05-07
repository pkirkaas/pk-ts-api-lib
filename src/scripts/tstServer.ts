/**
 * Testing initialization of API server
 */

import express from "express";

import {
	 runCli, typeOf, jsonClone, cwd, dbgWrt, allProps,
} from 'pk-ts-node-lib';

import {
	getApi, getPort, initApi, getStaticPath,  ApiOpts,
} from '../index.js';


let apiRouter = express.Router();

let api = await initApi({routers:{'/api':apiRouter}});;

apiRouter.get('/', async (req, res) => {
	console.log("In api root");
	res.json( { this: "api-root" });
});

apiRouter.get('/tst', async (req, res) => {
	console.log("In api tst");
	res.json( { that: "tst" });
});

api.useRouter('/api', apiRouter);

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

let apiProps = allProps(api);
//dbgWrt(apiProps);
//console.log({apiProps});

api.listenPort();
