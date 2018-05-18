import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import {enableProdMode} from '@angular/core';

// import * as express from 'express';
import * as Koa from 'koa';
import * as route from 'koa-route';
import * as serve from 'koa-static';
import * as accesslog from 'koa-accesslog';

import {join} from 'path';

/* Temporary fix: using non blocking ngFor on server
import {NgForOf} from "@angular/common";
import {NgForOfNb} from "../src/app/server-common/src/directives";

(<any>NgForOf).prototype._applyChanges = NgForOfNb.prototype._applyChanges;
*/

const blocked = require('blocked-at');
blocked((time, stack) => {
  console.log(`Blocked for ${time}ms, operation started here:`, stack)
});

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
// export const app = express();
export const app = new Koa();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('../dist/serverApp/main.bundle');

// Express Engine
// import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import {renderModuleFactory} from "@angular/platform-server";
import {readFileSync} from "fs";


let heroes = [];
for (let i = 0; i < 5000; i++) {
  heroes.push({id: i, name: `Hero-${i}`});
}

// app.use(morgan('dev'));
app.use(accesslog());

// Our index.html we'll use as our template
const template = readFileSync(join(process.cwd(), 'dist', 'browserApp', 'index.html')).toString();

app.use(route.get('/api/heroes', (ctx) => {
  ctx.body = heroes;
}));

app.use(route.get('/api/heroes/:id', (ctx, id) => {
  ctx.body = heroes.find((hero) => hero.id === +id);
}));

// app.set('view engine', 'html');
// app.set('views', join(process.cwd(), 'dist', 'browserApp'));

// Server static files from /browser
app.use(route.get('*.*', serve(join(process.cwd(), 'dist', 'browserApp'))));

// All regular routes use the Universal engine
app.use(route.get('(.*)', (ctx) => {
  return renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: ctx.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    ctx.body = html;
  });
}));
