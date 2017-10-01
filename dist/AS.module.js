// webpack-style async module loading

const Stats = require('stats.js');

const OrbitControls = import(
                  /* webpackChunkName: "OrbitControls" */
                  /* webpackMode: "eager" */
                  './OrbitControls.wrapper.js'
                );

const AS = require('./AS.premodule.js');

if (!THREE.OrbitControls && OrbitControls) THREE.OrbitControls = OrbitControls;

// TODO: requires SCSS loader. As an HTML script tag for now.
//const pDat = Promise.resolve();

window.AS = AS;
window.Stats = Stats;
//  window.THREE = THREE;   // done inside OrbitControls.wrapper.js

module.exports = AS;
