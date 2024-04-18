/**
 * Trying to componentize features
 */
import express from "express";
import 'express-async-errors';
export let eapp = express();
export function enhanceApi(api = null) {
    if (!api) {
        api = express();
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
        return this.listen(aport, () => { console.log(`API server self listening on port [${aport}]`); });
    };
    return api;
}
eapp.listenPort = function (aport = null) {
    if (!aport) {
        aport = this.port;
    }
    if (!aport) {
        aport = this.get('port');
    }
    if (!aport) {
        aport = process.env.PORT || 3000;
    }
    return this.listen(aport, () => { console.log(`API server self listening on port [${aport}]`); });
};
//# sourceMappingURL=lib-2.js.map