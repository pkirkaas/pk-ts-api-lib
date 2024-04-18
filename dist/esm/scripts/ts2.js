import express from "express";
import 'express-async-errors';
import listEndpoints from 'express-list-endpoints';
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import { enhanceApi, } from '../index.js';
let app = enhanceApi();
app.set('tstset', 'a-test-val');
app.rawset = "set without set";
let tstget = app.get('tstset');
let rgt = app.tstset;
let ars = app.rawset;
console.log({ tstget, rgt, ars, });
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({ this: "root" });
});
let r1 = express.Router();
r1.get('/', (req, res) => {
    res.send('From root of r1');
});
let r2 = express.Router();
r2.get('/', (req, res) => {
    res.send('From root of r2');
});
r2.get('/subr', (req, res) => {
    res.send('From subr root of r2');
});
let r3 = express.Router();
r3.get('/', (req, res) => {
    res.send('From root of r3');
});
//app.use('/r1pt', r1);
app.use('/r1pt', r1);
r1.use('/user1', r2);
app.use('/r3', r3);
//let apath = app.path();
//let apath = r2.path();
//console.log(`app.path(): [${apath}]`);
app.port = 4567;
let rs = listEndpoints(app);
let r2EP = listEndpoints(r2);
//let sroutes = app.getRoutes();
//let tst = app.print(); 
let tst = r1.stack;
let dbg = process.env.DEBUG;
console.log({ dbg });
//let tst = r1.route();
//dbgWrt(tst);
//console.log({ rs, r2EP, tst,  });
//console.log({ rs, r2EP,  });
//console.log({  tst, });
/*
let arprops = {
    //appProps: getProps(app, true),
    appMntPth: app.mountpath,
    //appRoute: app.route(),
    appPath: app.path,
    r1MntPth: r1.path,
    //r2Props: getProps(r2, true),
    //r2Route: r2.route(),
    //r2Path: r2.path(),
};

console.log({ arprops });
*/
/*
let arprops = {
    appProps: allProps(app, 'tvp', 7),
    r2Props: allProps(r2, 'tvp', 7),
};

dbgWrt(arprops);
*/
//console.log({ arprops });
//console.log('About to listen...');
//app.listenPort();
//# sourceMappingURL=ts2.js.map