/**
 * Not sure how to best do this - but trying to test various API configs - have to eventually include nestjs
 */
import { runCli, } from 'pk-ts-node-lib';
import { getPort, initApi, } from '../index.js';
let tstFncs = {
    async default() {
        console.log(`In API test.ts`);
    },
    async getPort() {
        let aport = getPort();
        console.log(`aport: [${aport}]`);
    },
    async tstSP() {
        let res = {};
        console.log({ res });
    },
    async tstApi() {
        console.log(`In API test.ts`);
        let app = await initApi();
        /*
        app.get('/test', async (req, res) => {
            return { this: "worked" };
        );
        app.listen();
        */
    },
};
runCli(tstFncs);
//# sourceMappingURL=test.js.map