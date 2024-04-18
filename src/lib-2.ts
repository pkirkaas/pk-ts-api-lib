/**
 * Trying to componentize features
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
	getDirname, dbgWrt, GenObj, cwd,
	getFilename, slashPath, typeOf,
	//} from "pk-ts-sqlite-lib";
} from "pk-ts-node-lib";

export let eapp = express();

export function enhanceApi(api:any = null) {
	if (!api) {
		api = express();
	}
	api.listenPort = function (aport: any = null) {
		if (!aport) {
			aport = this.port;
		}
		if (!aport) {
			aport = this.get('port');
		}
		if (!aport) {
			aport = process.env.PORT || 3000;
		}
		return this.listen(aport, () => { console.log(`API server self listening on port [${aport}]`) });
	};
	return api;
}

eapp.listenPort = function (aport: any = null) {
	if (!aport) {
		aport = this.port;
	}
	if (!aport) {
		aport = this.get('port');
	}
	if (!aport) {
		aport = process.env.PORT || 3000;
	}
	return this.listen(aport, () => { console.log(`API server self listening on port [${aport}]`) });
};


