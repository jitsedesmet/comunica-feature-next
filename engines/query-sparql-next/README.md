# Comunica SPARQL Next

[![npm version](https://badge.fury.io/js/%40comunica%2Fquery-sparql-next.svg)](https://www.npmjs.com/package/@comunica/query-sparql-next)
[![Docker Pulls](https://img.shields.io/docker/pulls/comunica/query-sparql-next.svg)](https://hub.docker.com/r/comunica/query-sparql-next/)

Comunica SPARQL Next is a SPARQL query engine for JavaScript for querying over decentralized RDF knowledge graphs on the Web using non-standardised functionalities.


This module is part of the [Comunica framework](https://comunica.dev/).
[Click here to learn more about Comunica and It's next features](https://comunica.dev/docs/query/advanced/next/).

## Install

```bash
$ yarn add @comunica/query-sparql-next
```

or

```bash
$ npm install -g @comunica/query-sparql-next
```

## Usage

Show 100 triples from http://fragments.dbpedia.org/2015-10/en:

```bash
$ comunica-sparql-next https://fragments.dbpedia.org/2015-10/en "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 100"
```

Show all triples from http://dbpedia.org/resource/Belgium:

```bash
$ comunica-sparql-next https://dbpedia.org/resource/Belgium "CONSTRUCT WHERE { ?s ?p ?o }"
```

Just like [Comunica SPARQL](https://github.com/comunica/comunica/tree/master/packages/query-sparql),
a [dynamic variant](https://github.com/comunica/comunica/tree/master/packages/query-sparql#usage-from-the-command-line) (`comunica-dynamic-sparql-next`) also exists.

_[**Read more** about querying from the command line](https://comunica.dev/docs/query/getting_started/query_cli/)._


### Usage as a SPARQL endpoint

Start a webservice exposing https://fragments.dbpedia.org/2015-10/en via the SPARQL protocol, i.e., a _SPARQL endpoint_.

```bash
$ comunica-sparql-next-http https://fragments.dbpedia.org/2015/en
```

Show the help with all options:

```bash
$ comunica-sparql-next-http --help
```

The SPARQL endpoint can only be started dynamically.
An alternative config file can be passed via the `COMUNICA_CONFIG` environment variable.

Use `bin/http.js` when running in the Comunica monorepo development environment.

_[**Read more** about setting up a SPARQL endpoint](https://comunica.dev/docs/query/getting_started/setup_endpoint/)._


### Usage within application

This engine can be used in JavaScript/TypeScript applications as follows:

```javascript
const bindingsStream = await myEngine.queryBindings(`
  SELECT ?s ?p ?o WHERE {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`, {
  sources: [ 'http://fragments.dbpedia.org/2015/en' ],
});

// Consume results as a stream (best performance)
bindingsStream.on('data', (binding) => {
  console.log(binding.toString()); // Quick way to print bindings for testing

  console.log(binding.has('s')); // Will be true

  // Obtaining values
  console.log(binding.get('s').value);
  console.log(binding.get('s').termType);
  console.log(binding.get('p').value);
  console.log(binding.get('o').value);
});
bindingsStream.on('end', () => {
  // The data-listener will not be called anymore once we get here.
});
bindingsStream.on('error', (error) => {
  console.error(error);
});

// Consume results as async iterable (easier)
for await (const binding of bindingsStream) {
  console.log(binding.toString());
}

// Consume results as an array (easier)
const bindings = await bindingsStream.toArray();
console.log(bindings[0].get('s').value);
console.log(bindings[0].get('s').termType);
```

_[**Read more** about querying an application](https://comunica.dev/docs/query/getting_started/query_app/)._

## Learn more

This README just shows the tip of the iceberg!
Learn more about Comunica's functionalities in the following guides:

* _[Updating from the command line](https://comunica.dev/docs/query/getting_started/update_cli/)_
* _[Updating in a JavaScript app](https://comunica.dev/docs/query/getting_started/update_app/)_
* _[Querying in a JavaScript browser app](https://comunica.dev/docs/query/getting_started/query_browser_app/)_
* _[Passing query options](https://comunica.dev/docs/query/advanced/context/)_
* _[Supported source types](https://comunica.dev/docs/query/advanced/source_types/)_
* _[Supported destination types](https://comunica.dev/docs/query/advanced/destination_types/)_
* _[Formatting results](https://comunica.dev/docs/query/advanced/result_formats/)_
* _[Supported specifications](https://comunica.dev/docs/query/advanced/specifications/)_
* _[Logging and debugging](https://comunica.dev/docs/query/advanced/logging/)_
* _[Caching](https://comunica.dev/docs/query/advanced/caching/)_
* _[Using a proxy](https://comunica.dev/docs/query/advanced/proxying/)_
* _[HTTP basic authentication](https://comunica.dev/docs/query/advanced/basic_auth/)_
* _[GraphQL-LD](https://comunica.dev/docs/query/advanced/graphql_ld/)_
* _[Docker](https://comunica.dev/docs/query/getting_started/query_docker/)_
* _[*Full documentation*](https://comunica.dev/docs/)_

