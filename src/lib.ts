/**
 * Library of useful, general Express API functions & initializations. Can be used by NestJS as well, hopefully
 * 
 * TODO: Generalize!!!
 * 
 * TODO: Make sure can use both NestJS api and regular express...
 * Think about logging/loggers, middlewae, 
 * sessions, session implementation, auth, etc.
 */

import path from 'path';
import util from 'util';
import killPort from 'kill-port';
import _ from "lodash";
import express from "express";
import compression from "compression";
import 'express-async-errors';

import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {
	getDirname, isEmpty, dbgWrt, GenObj, cwd, isDirectory, isFile, isClassOrFunction,
	getFilename, isObject, slashPath, typeOf, PkError, subObj,
} from "pk-ts-node-lib";

//export type = {

export function getReqFields(req,extraFields:any[]=[]) {
 let reqFieldList:any[] = [ 
'baseUrl', 'body', 'cookies', 'hostname', 'ip', 'method',
'originalUrl', 'params', 'path', 'protocol', 'query', {route:['path']},
'secure', 'subdomains', ];
//console.log('in getReqFields', {reqFieldList});
let reqFields = subObj(req, reqFieldList);
return reqFields;
}

/**
 * The LAST middleware in the API
 * Should it be async?
 */
export async function defaultErrorHandler(error, req, res, next) {
	let reqDets = getReqFields(req);
	console.error(`Default ErrorHandler Middleware`,{reqDets, error});
	res.status(501).json({msg:`Server error in API call`, error, reqDets});


}

export let port: any = null;

export function getPort(aPort: any = null) {
	if (!port) {
		if (aPort) {
			port = aPort;
		} else {
			port = process.env.PORT || 3000;
		}
	}
	return port;
}

export let defaultRelStaticPath = 'fe/build'

export let api: any = null;
/** 
 * Implementing API can create a custom api, or default to Express.
 * @param anApi ? Optional Initialize api 
 * @return an api instance - express, NestJS, etc
 */
export function getApi(anApi:any = null) {
//	console.log(`In getApi`);
	if (!api) {
		if (anApi) {
			api = anApi;
		}
	} else {

	//console.log(`Initializing the api In getApi`);
		api = express();
	}
	return api;
}

/**
 * Turns out to be difficult, since has to be absolute path & we don't easily knoow where we are...
 * So we have to go up the tree....
 * @param dirname - the name of the directory where the server script lives
 * @param apath - optional relpath, else defaunt 
 */
//export function getStaticPath(apath:any = null) {
export function getStaticPath(dirname:string, apath?:string) {
	if (!apath) {
		apath = defaultRelStaticPath;
	}
	let tstDir = dirname;
	let staticPath = '';
	for (let i =0; i<4; i++) {
		tstDir = slashPath(tstDir,'..');
		staticPath = slashPath(tstDir, apath);
		//console.log(`Testing staticPath`, {dirname, apath, tstDir, staticPath});
		if (isDirectory(staticPath)) {
			console.log(`Found the static path! [${staticPath}]`);
			return staticPath
		}
	}
	throw new PkError(`Could find static path - last checked was: [${staticPath}]`);
}



/**
 * Initialize the API to use Cors, bodyParser, whatever   
 * @param opts:object - use cors, what port, base URL, etc. Has some defaults.
 *   api: null (defaults to express()).  or an api 
 *   cors: boolean (true),
 *   port: empty|number (defaults to process.env.PORT or 3000),
 *   compression: boolean (true),
 *   killPort : booldean (true), // For dev - kill if api already running on port FOR DEV
 *   urlencoded: boolean (true) - if true, use extended
 *   static: boolean (true) | string (relative path or absolute path),
 *   apiBase : string (defaults to 'api'),
 * 
 * 
 * 
 * @return initialized api
 */

/**
 * Parameters to initialize the server/API
 */
export type ApiOpts = {
	port?: number|string,
	killPort?:boolean,
	cors?: boolean,
	compression?: boolean,
	json?: boolean,
	urlencoded?: boolean,
	cookieParser?: boolean,
	static?:string, //If present, has to absolute path where the FE is found
	routers?: {[key: string]:any}, //Object keyed with string pathSegment to the routers
	unhandledRoutes?:any, //If true, try to catch & process unandled routes - true, false or function, or oject keyed path:opt
	errorHandler?:any, //If true, try to catch & process unandled errors - true, false or function, or oject keyed path:opt

};
export  function initApi(opts: ApiOpts = {}) {
	let defaults:ApiOpts = {
		killPort: false,
		cors: true,
//		bodyParser: true,
		compression: true,
		routers:{},
		json: true,
		urlencoded: true,
		cookieParser: true,
		//unhandledRoutes:{api:true},
		unhandledRoutes:true,
		errorHandler:true,
	};

	let settings:ApiOpts = Object.assign({}, defaults, opts);
	//console.log(`In initApi - settings:`,{settings});

	//settings.api = getApi(settings.api);
	if (settings.killPort) {
		let kport = getPort();
		console.log(`Oh, trying to kill port [${kport}]!`);

		//Not sure this works?
    killPort(getPort()) .then() .catch();
		// Reports an error on Windows - expects a PID - but maybe because nothin is on that port?
	}


	settings.port = getPort(settings.port);
	console.log(`Thinking port is: [${settings.port}]`);
	let appInitOpts: GenObj = {};
	api = express();
	api.myRouters =  {};

	/** Add  */
	api.useRouter = (path:string, router) => {
		if (!router.subpath) {
			router.subpath = path;
		 }
		api.myRouters[path] = router;
		api.use(path, router);

	};


	/*
	if (settings.apiBase) {
		let apiBase = settings.apiBase;
		let apiRouter = express.Router();
		apiRouter.get('/', (req, res) => {
			res.json( { this: "root" });
    });

		api.useRouter(apiBase, apiRouter);
		console.log(`Trying to use apiBase? Pre...`, apiBase);
	}
	*/

	api.set('port',settings.port)

	if (settings.cors) {
		api.use(cors());
	}
	if (settings.compression) {
		api.use(compression());
	}

	if (settings.json) {
		api.use(bodyParser.json());
	}

	if (settings.urlencoded) {
		api.use(bodyParser.urlencoded({ extended: true }));
	}

	/**
	 * If not empty - use path for static rendering.
	 * If true, use a default path for the fe. Assumes fe/static path is 
	 * If a string, can be relative or absolute path.
	 */




	//debugging...
	if (settings.static) { // Either true or a string path
		let staticPath = settings.static;
		if (!isDirectory(staticPath)) { //double check
			throw new PkError(`In initApi - bad setting for static - should be a dir, but is: [${staticPath}]`);
		}
		console.log(`We think the static FE path should be: [${staticPath}]`);
		api.staticPath = staticPath;
		api.use(express.static(staticPath));
	}
//	console.log(`Is the port REALLY: [${port}]? Settings are:`, { settings });
	if (!(isEmpty(settings.routers))) { // routers keyed by path
		//let unhandledRoutes = settings.unhandledRoutes;
		for (let path in settings.routers) {
			//if(isObject(unhandledRoutes)) { if(unhandledRoutes[path]) { } };
			let router = settings.routers[path];
			api.useRouter(path, router);
		}
	}

	let unhandledRoutes = settings.unhandledRoutes;

	if (unhandledRoutes) { // What possible values? For now, just if true, report all unhandled routes
		console.log("Hoping to handle unhandledRoutes");
		let handlerFunction:any = null;
		if (unhandledRoutes === true) { // Generic Handling
			console.log(`Creating generic unhandled route handler`);
			 handlerFunction = async (req, res) => {
			let reqData = getReqFields(req);
			let fpath = //dbgWrt({reqData});
			console.error(`Unhandled Route - data:`,{reqData,});
			res.status(404).json({unhandledRoute:reqData});
			};
		} else if (typeof unhandledRoutes === 'function') {
			console.log(`Creating custom unhandled route handler`);
			handlerFunction = unhandledRoutes;
		}  
		if (handlerFunction) {
			console.log(`Thinking we have a handler function`);
			api.all('/api/*', handlerFunction);
		} else {
			console.error(`Don't know what to do with init val unhandledRoutes:`,{unhandledRoutes});
		}
	}
	 

	let errorHandler = settings.errorHandler;
//errorHandler
	if (errorHandler) { // What possible values? For now, just if true, report all unhandled routes
		console.log("Hoping to handle unhandledRoutes");
		let handlerFunction:any = null;
		if (errorHandler === true) { // Generic Handling
			console.log(`Using generic error handler`);
			 handlerFunction = defaultErrorHandler;
			//let reqData = getReqFields(req);
			//let fpath = //dbgWrt({reqData});
			//console.error(`Unhandled Route - data:`,{reqData,});
			//res.status(404).json({unhandledRoute:reqData});
			
		} else if (typeof errorHandler === 'function') { //Custom Error Handler
			console.log(`Creating custom unhandled route handler`);
			handlerFunction = errorHandler;
		}  
		if (handlerFunction) {
			console.log(`Thinking we have a error handler function`);
			api.use(handlerFunction);
		} else {
			console.error(`Don't know what to do with init val unhandledErrors:`,{errorHandler});
		}
	}
	 


	api.listenPort = async function (aport: any = null) {
		if (!aport) {
			aport = this.port;
		}
		if (!aport) {
			aport = this.get('port');
		}
		if (!aport) {
			aport = process.env.PORT || 3000;
		}
		if (this.staticPath) {
			// For react routing - have to send every route NOT starting w. '/api/xxx' to the static index file 
			let staticFile = slashPath(this.staticPath,'index.html');
			if (!isFile(staticFile)) {
				throw new PkError(`The file [${staticFile}] not found`);
			}

			console.log(`Redirecting all other URLs to [${staticFile}]`);
			this.get("*", (req, res) => {
				let origUrl = req.originalUrl;
				//console.log(`sending request URL [${origUrl}] to [${staticFile}]`);
				res.sendFile(staticFile);
			});
		}
		try {
			let listen = await this.listen(aport, () => { console.log(`API server self listening on port [${aport}]`) });
			return listen;
		} catch(e) {
			console.error(`The port was busy - let's try killing it!`);
			//await killPort(getPort());
			await killPort(aport);
			let listen = await this.listen(aport, () => { console.log(`After kill port - try again... API server self listening on port [${aport}]`) });
			return listen;
		}
	}

	// Have to listen on the port set here like:
	// api.listen(api.get('port'), () => {console.log(`API server listening on port [${api.get('port')}]`)});

	return api;
}


// Create an Express api
//export const api = express();
//const dirName = '.';
//const staticDir = '../../fe/public';
//const dirName = getDirname(import.meta.url);
//const staticDir = slashPath(getDirname(import.meta.url, '../../fe/public'));
//const staticDir = slashPath(dirName, '../../fe/public');

//const port =  process.env.PORT || 3000;
/*
await killPort(port);

// Enable CORS
api.use(cors());

// Try out compression - but check if it all works?
// compress all responses
api.use(compression());
// Express configuration
api.set('port', port);

// Parse JSON requests
api.use(bodyParser.json());

api.use(bodyParser.urlencoded({ extended: true }));

// Create a new router object
export const apiRouter = express.Router();

*/







