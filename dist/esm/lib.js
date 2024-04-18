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
import killPort from 'kill-port';
import express from "express";
import compression from "compression";
import 'express-async-errors';
import cors from "cors";
import bodyParser from "body-parser";
import { cwd, slashPath, typeOf, } from "pk-ts-node-lib";
export let port = null;
export function getPort(aPort = null) {
    if (!port) {
        if (aPort) {
            port = aPort;
        }
        else {
            port = process.env.PORT || 3000;
        }
    }
    return port;
}
export let defaultRelStaticPath = '../../fe/build';
export let api = null;
/**
 * Implementing API can create a custom api, or default to Express.
 * @param anApi ? Optional Initialize api
 * @return an api instance - express, NestJS, etc
 */
export function getApi(anApi = null) {
    console.log(`In getApi`);
    if (!api) {
        if (anApi) {
            api = anApi;
        }
    }
    else {
        console.log(`Initializing the api In getApi`);
        api = express();
    }
    return api;
}
/**
 * If false, returns default static path based on current working directory & defaultRelStaticPath
 * If
 */
export function getStaticPath(apath = null) {
    let tstCwd = process.cwd();
    console.log("In getSP:", { cwd, tstCwd });
    if (apath === false) {
        return false;
    }
    if (!apath || (apath === true)) {
        apath = defaultRelStaticPath;
    }
    if (!path.isAbsolute(apath)) {
        apath = slashPath(cwd, apath);
    }
    return apath;
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
export async function initApi(opts = {}) {
    /*
    if (!api) {
        api = getApi();
    }
    */
    //let inApi = getApi();
    //let toIA = typeOf(inApi);
    let toIA = 'tst';
    let toA = typeOf(api);
    console.log("In initapp:", { toA, toIA });
    let defaults = {
        //		port :  process.env.PORT || 3000,
        killPort: true,
        cors: true,
        //		bodyParser: true,
        compression: true,
        json: true,
        urlencoded: true,
        cookieParser: true,
        static: true,
        apiBase: '/api',
    };
    let settings = Object.assign({}, defaults, opts);
    //settings.api = getApi(settings.api);
    if (settings.killPort) {
        await killPort(getPort());
    }
    settings.port = getPort(settings.port);
    console.log(`Thinking port is: [${settings.port}]`);
    let appInitOpts = {};
    api = express();
    if (settings.apiBase) {
        let apiBase = settings.apiBase;
        let apiRouter = express.Router();
        apiRouter.get('/', (req, res) => {
            res.json({ this: "root" });
        });
        let apiAuthRouter = express.Router();
        apiAuthRouter.get('/', (req, res) => {
            res.json({ auth: "subauth" });
        });
        apiRouter.use('/auth', apiAuthRouter);
        // api.use(apiBase, apiAuthRouter);
        api.use(apiBase, apiRouter);
        //api = express({ baseUrl: apiBase });
        //api = express({ basepath: apiBase });
        //api.set('base', apiBase);
        console.log(`Trying to use apiBase? Pre...`, apiBase);
        //let apiRouter = express.Router();
        //api.use(settings.apiBase, apiRouter);
        /*
            console.log(`Trying to use apiBase? Pre...`, settings.apiBase);
            api.use(settings.apiBase, async (req, res, next) => {
                console.log(`Trying to use apiBase? ...In`, settings.apiBase);
                next();
            });
            */
    }
    /*
    else {
        console.log(`Intitalize api withoug base!!`);
            api = express();
    }
    */
    api.set('port', settings.port);
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
        let staticPath = '';
        if (settings.static === true) { //use default
            staticPath = defaultRelStaticPath;
        }
        else {
            staticPath = settings.static;
        }
        if (!path.isAbsolute(staticPath)) { // Make absolute path - hmm, might be very tricky to get right base path
            staticPath = slashPath(cwd, staticPath);
        }
        console.log(`We think the static FE path should be: [${staticPath}]`);
        api.use(express.static(staticPath));
    }
    /*
    */
    /*
    */
    /*
    */
    console.log(`Is the port REALLY: [${port}]? Settings are:`, { settings });
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
//# sourceMappingURL=lib.js.map