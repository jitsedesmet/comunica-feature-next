<p align="center">
  <a href="https://comunica.dev/">
    <img alt="Comunica" src="https://comunica.dev/img/comunica_red.svg" width="200">
  </a>
</p>

<p align="center">
  <strong>Comunica for experimental query execution packages</strong>
</p>

<p align="center">
<a href="https://github.com/comunica/comunica-feature-next/actions?query=workflow%3ACI"><img src="https://github.com/comunica/comunica-feature-next/workflows/CI/badge.svg" alt="Build Status"></a>
<a href="https://coveralls.io/github/comunica/comunica-feature-next?branch=master"><img src="https://coveralls.io/repos/github/comunica/comunica-feature-next/badge.svg?branch=master" alt="Coverage Status"></a>
<a href="https://gitter.im/comunica/Lobby"><img src="https://badges.gitter.im/comunica.png" alt="Gitter chat"></a>
</p>

**[Learn more about Comunica on our website](https://comunica.dev/).**

This is a monorepo that contains packages for allowing [Comunica](https://github.com/comunica/comunica) to execute experimental SPARQL features.
With _experimental_ we **don't mean unstable, rather non-standardized**.
**If you want to _use_ a Comunica Next engine, have a look at [Comunica SPARQL next](https://github.com/comunica/comunica-feature-next/tree/master/engines/query-sparql-next).**

Concretely, this monorepo adds experimental features support to Comunica using the following packages in the [packages directory](./packages).

[Click here to learn more about Comunica Next, or to see live examples](https://comunica.dev/docs/query/advanced/next/). TODO: Make page

## Development Setup

_(JSDoc: https://comunica.github.io/comunica-feature-next/)_

This repository should be used by Comunica module **developers** as it contains multiple Comunica modules that can be composed.
This repository is managed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)
using [Lerna](https://lernajs.io/).

If you want to develop new features
or use the (potentially unstable) in-development version,
you can set up a development environment for Comunica.

Comunica requires [Node.JS](http://nodejs.org/) 8.0 or higher and the [Yarn](https://yarnpkg.com/en/) package manager.
Comunica is tested on OSX, Linux and Windows.

This project can be setup by cloning and installing it as follows:

```bash
$ git clone https://github.com/comunica/comunica-feature-next.git
$ cd comunica-feature-next
$ yarn install
```

**Note: `npm install` is not supported at the moment, as this project makes use of Yarn's [workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) functionality**

This will install the dependencies of all modules, and bootstrap the Lerna monorepo.
After that, all [Comunica packages](https://github.com/comunica/comunica-feature-next/tree/master/packages) are available in the `packages/` folder
and can be used in a development environment, such as querying with [Comunica SPARQL Next (`engines/query-sparql-next`)](https://github.com/comunica/comunica-feature-next/tree/master/engines/query-sparql-next).

Furthermore, this will add [pre-commit hooks](https://www.npmjs.com/package/pre-commit)
to build, lint and test.
These hooks can temporarily be disabled at your own risk by adding the `-n` flag to the commit command.

## License
This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/)
and released under the [MIT license](http://opensource.org/licenses/MIT).
