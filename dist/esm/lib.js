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
import { cwd, isDirectory, isFile, slashPath, PkError, } from "pk-ts-node-lib";
//export type = {
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
export let defaultRelStaticPath = '../fe/build';
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
    if (!isDirectory(apath)) {
        throw new PkError(`${apath} is not a directory`);
    }
    return apath;
}
export function initApi(opts = {}) {
    let defaults = {
        killPort: false,
        cors: true,
        //		bodyParser: true,
        compression: true,
        json: true,
        urlencoded: true,
        cookieParser: true,
        static: true,
    };
    let settings = Object.assign({}, defaults, opts);
    //settings.api = getApi(settings.api);
    if (settings.killPort) {
        let kport = getPort();
        console.log(`Oh, trying to kill port [${kport}]!`);
        //Not sure this works?
        killPort(getPort()).then().catch();
        // Reports an error on Windows - expects a PID - but maybe because nothin is on that port?
    }
    settings.port = getPort(settings.port);
    console.log(`Thinking port is: [${settings.port}]`);
    let appInitOpts = {};
    api = express();
    api.myRouters = {};
    /** Add  */
    api.useRouter = (path, router) => {
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
        let staticPath = getStaticPath(settings.static);
        /*
        let staticPath  = '';
        if (settings.static === true) { //use default
            staticPath = defaultRelStaticPath;
        } else {
            staticPath = settings.static;
        }
        if (!path.isAbsolute(staticPath)) { // Make absolute path - hmm, might be very tricky to get right base path
            staticPath = slashPath(cwd, staticPath);
        }
        */
        console.log(`We think the static FE path should be: [${staticPath}]`);
        api.staticPath = staticPath;
        api.use(express.static(staticPath));
    }
    //	console.log(`Is the port REALLY: [${port}]? Settings are:`, { settings });
    if (settings.routers) { // routers keyed by path
        for (let path in settings.routers) {
            let router = settings.routers[path];
            api.useRouter(path, router);
        }
    }
    api.listenPort = function (aport = null) {
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
            let staticFile = slashPath(this.staticPath, 'index.html');
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
        return this.listen(aport, () => { console.log(`API server self listening on port [${aport}]`); });
    };
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