import * as ng from '@angular/compiler';
import {codeToHtml} from 'shiki';

import {formatJs} from './prettier';
import {Context, Printer} from './printer';

export function compileTemplate(templateStr: string): string {
  const constantPool = new ng.ConstantPool();
  const template = ng.parseTemplate(templateStr, 'template.html', {
    preserveWhitespaces: false,
  });

  const CMP_NAME = 'TestCmp';

  const out = ng.compileComponentFromMetadata(
      {
        name: CMP_NAME,
        isStandalone: true,
        selector: 'test-cmp',
        host: {
          attributes: {},
          listeners: {},
          properties: {},
          specialAttributes: {},
        },
        inputs: {},
        outputs: {},
        lifecycle: {
          usesOnChanges: false,
        },
        hostDirectives: null,
        declarations: [],
        declarationListEmitMode: ng.DeclarationListEmitMode.Direct,
        deps: [],
        animations: null,
        defer: {
          dependenciesFn: null,
          mode: ng.DeferBlockDepsEmitMode.PerComponent,
        },
        i18nUseExternalIds: false,
        interpolation: ng.DEFAULT_INTERPOLATION_CONFIG,
        isSignal: false,
        providers: null,
        queries: [],
        styles: [],
        template,
        encapsulation: ng.ViewEncapsulation.Emulated,
        exportAs: null,
        fullInheritance: false,
        changeDetection: null,
        relativeContextFilePath: 'template.html',
        type: {
          value: new ng.WrappedNodeExpr(CMP_NAME),
          type: new ng.WrappedNodeExpr(CMP_NAME),
        },
        typeArgumentCount: 0,
        typeSourceSpan: null!,
        usesInheritance: false,
        viewProviders: null,
        viewQueries: [],
      },
      constantPool, ng.makeBindingParser(ng.DEFAULT_INTERPOLATION_CONFIG));

  const printer = new Printer();
  let strExpression =
      out.expression.visitExpression(printer, new Context(false));

  for (const stmt of constantPool.statements) {
    const strStmt = stmt.visitStatement(printer, new Context(true));

    strExpression += `\n\n${strStmt}`;
  }

  return strExpression;
}



export function compileFormatAndHighlight(template: string): Promise<string> {
  const unformated = compileTemplate(template);

  return formatJs(unformated).then((str) => {
    return codeToHtml(str, {
      lang: 'javascript',
      theme: 'github-dark',
    });
  });
}
