import type { ParserBuildArgs } from '@traqula/core';
import { ParserBuilder } from '@traqula/core';
import { sparql12ParserBuilder } from '@traqula/parser-sparql-1-2';
import { gram as gram11 } from '@traqula/rules-sparql-1-1';
import { gram as gramAdj } from '@traqula/rules-sparql-1-1-adjust';
import type * as T12 from '@traqula/rules-sparql-1-2';
import { gram as gram12, completeParseContext, copyParseContext } from '@traqula/rules-sparql-1-2';
import { sparqlNextLexerBuilder } from './lexer';

const existingBuiltIn = sparql12ParserBuilder.getRule('builtInCall');
const builtInPatch: typeof existingBuiltIn = {
  name: 'builtInCall',
  impl: $ => c => $.OR([
    { ALT: () => existingBuiltIn.impl($)(c) },
    { ALT: () => $.SUBRULE(gramAdj.builtInAdjust) },
  ]),
};

export const sparqlNextParserBuilder = ParserBuilder
  .create(sparql12ParserBuilder)
  .patchRule(gram11.prologue)
  .patchRule(gram12.prologue)
  .addRule(gramAdj.builtInAdjust)
  .patchRule(builtInPatch);

export type FullSparqlNextParser = ReturnType<typeof sparqlNextParserBuilder.build>;

/**
 * Parser that can parse a SPARQL Next string into a SPARQL Next AST.
 */
export class SparqlNextParser {
  private readonly parser: FullSparqlNextParser;
  protected readonly defaultContext: T12.SparqlContext;

  public constructor(
    args: Pick<ParserBuildArgs, 'parserConfig' | 'lexerConfig'> & { defaultContext?: Partial<T12.SparqlContext> } = {},
  ) {
    this.parser = sparqlNextParserBuilder.build({
      ...args,
      tokenVocabulary: sparqlNextLexerBuilder.tokenVocabulary,
    });
    this.defaultContext = completeParseContext(args.defaultContext ?? {});
  }

  /**
   * Parse a query string starting from the
   * [QueryUnit](https://www.w3.org/TR/sparql12-query/#rQueryUnit)
   * or [QueryUpdate](https://www.w3.org/TR/sparql12-query/#rUpdateUnit) rules.
   * @param query
   * @param context
   */
  public parse(query: string, context: Partial<T12.SparqlContext> = {}): T12.SparqlQuery {
    const ast = this.parser.queryOrUpdate(query, copyParseContext({ ...this.defaultContext, ...context }));
    ast.loc = this.defaultContext.astFactory.sourceLocationInlinedSource(query, ast.loc, 0, Number.MAX_SAFE_INTEGER);
    return ast;
  }
}
