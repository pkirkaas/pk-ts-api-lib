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
 * If false, returns default static path based on current working directory & defaultRelStaticPath
 * If
 */
export declare function getStaticPath(apath?: any): any;
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
    static?: boolean | string;
    routers?: {
        [key: string]: any;
    };
};
export declare function initApi(opts?: ApiOpts): any;
//# sourceMappingURL=lib.d.ts.map