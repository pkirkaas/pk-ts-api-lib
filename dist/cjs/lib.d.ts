/**
 * Library of useful, general Express API functions & initializations. Can be used by NestJS as well, hopefully
 *
 * TODO: Generalize!!!
 *
 * TODO: Make sure can use both NestJS api and regular express...
 * Think about logging/loggers, middlewae,
 * sessions, session implementation, auth, etc.
 */
import 'express-async-errors';
import { GenObj } from "pk-ts-node-lib";
export declare function getReqFields(req: any, extraFields?: any[]): GenObj;
export declare let port: any;
export declare function getPort(aPort?: any): any;
export declare let defaultRelStaticPath: string;
export declare let api: any;
/**
 * Implementing API can create a custom api, or default to Express.
 * @param anApi ? Optional Initialize api
 * @return an api instance - express, NestJS, etc
 */
export declare function getApi(anApi?: any): any;
/**
 * Turns out to be difficult, since has to be absolute path & we don't easily knoow where we are...
 * So we have to go up the tree....
 * @param dirname - the name of the directory where the server script lives
 * @param apath - optional relpath, else defaunt
 */
export declare function getStaticPath(dirname: string, apath?: string): string;
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
    port?: number | string;
    killPort?: boolean;
    cors?: boolean;
    compression?: boolean;
    json?: boolean;
    urlencoded?: boolean;
    cookieParser?: boolean;
    static?: string;
    routers?: {
        [key: string]: any;
    };
    unhandledRoutes?: any;
};
export declare function initApi(opts?: ApiOpts): any;
//# sourceMappingURL=lib.d.ts.map