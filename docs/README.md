## AgentScript-next Repository

This is a repository for the next version of the CoffeeScript [AgentScript 1.0](http://agentscript.org) Agent Based Modeling framework, converted into an es6 module based project.

### Developer Information

To clone a fresh repo, for PRs or your own local verson:
* cd to where you want the asx/ dir to appear.
* git clone https://github.com/backspaces/asx # create skeleton repo
* cd asx # go to new repo
* npm install # install all dev dependencies & runs `npm run build`
* open `http://<path to asx>/test` and check console for messages

All workflow is npm run scripts.  See package.json's scripts, or simply run `npm run` for a list.

The repo has no "derived" files, other than gh-page, see below, i.e. won't run by just cloning. To complete the repo, use `npm install` which refreshes npm dependencies and does a clean build of the repo.

### Github Pages

A [gh-pages branch](http://backspaces.github.io/asx/) is used for the site. It contains the master repo, including the derived files. It uses [the docs/ simplification](https://help.github.com/articles/user-organization-and-project-pages/#project-pages) for gh-page creation. A new page is built each commit automatically.

This can be used to run example models and access documentation:
* [http://backspaces.github.io/asx/models?diffuse](http://backspaces.github.io/asx/models?diffuse)
* [http://backspaces.github.io/asx/doc/Model.html](http://backspaces.github.io/asx/doc/Model.html)

It can also be used as a CDN for all the es6 Modules:

* `import Model from` '[http://backspaces.github.io/asx/dist/AS/Model.js](http://backspaces.github.io/asx/dist/AS/Model.js)'

..as well as these modules bundled into a traditional IIFE, see **Modules and Bundles** below.
* `<script src="`[http://backspaces.github.io/asx/dist/AS.js](http://backspaces.github.io/asx/dist/AS.js)`"></script>`

### Three.js

ASX has been converted from layers of 2D canvases to a single WebGL canvas, currently managed by [Three.js](https://threejs.org/). This is a breaking change, primarily changing subclassing of class Model.

The 'div' used by Model's constructor defaults to `document.body`, the whole page. In addition, there is a Three parameters object in the constructor, defaulting to that used by the test.html suite.

The conversion of the [fire](http://backspaces.github.io/asx/models?fire) model is an example of the minor changes needed in converting to Three.js.

### Modules and Bundles

ASX is entirely es6 Modules based, and the dist/ dir includes both a [Rollup](https://rollupjs.org/) generated legacy [IIFE](http://adripofjavascript.com/blog/drips/an-introduction-to-iffes-immediately-invoked-function-expressions.html) global, window.AS, for script users, and the AS/ dir of the modules for direct native module implementations (Canary, Edge, FFox Nightly, iOS Safari and Safari Technology Preview), see the [CanIUse](http://caniuse.com/#search=modules) page for current browser support.

### Files

Our directory layout is:
```
bin: workflow scripts
dist: AS bundle & AS/ es6 modules distribution
doc: docco src documentation
libs: dependencies
models: sample models
src: es6 modules for AS
test: tests of AS modules
```

Within models and test directories are src/ (es6 modules) and scripts/ (legacy) and an index.html which runs the src/scripts files as a query string/REST. Both index.html files have a default.

There are currently two ways to run a sample model: es6 modules (src/) or legacy scripts (scripts/), the latter runs only in browsers supporting modules (see above):

* [http://backspaces.github.io/asx/models?scripts/fire](http://backspaces.github.io/asx/models?scripts/fire)
* [http://backspaces.github.io/asx/models?src/fire](http://backspaces.github.io/asx/models?src/fire)

The default directory is scripts/ for now, but will convert to es6 modules, src/, when widely supported. This url will use the default:

* [http://backspaces.github.io/asx/models?fire](http://backspaces.github.io/asx/models?fire)

The current sample models are: diffuse, fire, links, turtles

### Documentation

Developer Documentation is created by [docco](https://jashkenas.github.io/docco/) and is [available here](http://backspaces.github.io/asx/doc/Model.html) Use **Jump To** menu, top right, to navigate between modules.

#### License

Copyright Owen Densmore, RedfishGroup LLC, 2012-2017<br>
AgentScript may be freely distributed under the GPLv3 license:

AgentScript is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program, see LICENSE within the distribution.
If not, see <http://www.gnu.org/licenses/>.