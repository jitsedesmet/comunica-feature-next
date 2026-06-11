const QueryEngine = require('@comunica/query-sparql-next').QueryEngine;
module.exports = require('./sparql-engine-base.js')(new QueryEngine());
