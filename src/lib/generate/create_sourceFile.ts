import ts, { factory } from "typescript";
import { tokenizeInput } from "../tokenize/tokenizeInput";
import { RowModel } from "../types/RowModel";
import { create_eventByName_ObjectLiteral } from "./create_eventByName_ObjectLiteral";

function createInMemorySourceFile(content: string) {
  return ts.createSourceFile(
    "virtual-file.ts",
    content,
    ts.ScriptTarget.Latest
  );
}

export async function create_sourceFile({
  rows,
  reportName,
}: {
  rows: RowModel[];
  reportName: string;
}): Promise<ts.SourceFile[]> {
  const tokens = tokenizeInput(rows);
  const eventByName = create_eventByName_ObjectLiteral({ tokens, reportName });

  const hasPageWithStart = tokens.some((t) =>
    t.itemLocation.some((l) => l.type === "pageWithStart")
  );

  return [
    createInMemorySourceFile(
      `import { generateStringDataPath, EventAnalytics, EventAnalyticsProperties } from "@lion-team/analytics"`
    ),
    createInMemorySourceFile(`
      export type EMPTY_EXTRA_PROPS = Record<string, unknown> | undefined

      export type EventConfig<TExtraProperties extends EMPTY_EXTRA_PROPS = EMPTY_EXTRA_PROPS> = {
        countryCode?: string
        provider?: ProviderType
        locationName?: string
        ${hasPageWithStart ? "GALabel?: GALabel" : ""}
      } & TExtraProperties

      export type EventFactory<TEventsObject extends Record<string, EventConfig<EMPTY_EXTRA_PROPS>>> = {
        [TEventName in keyof TEventsObject]: (gaEventParams: TEventsObject[TEventName]) => {
          event: EventAnalytics
          eventProperties: EventAnalyticsProperties
        }
      }

      export type GAEvent = keyof typeof ga4events

      export type GAEventParams<TEventName extends GAEvent> = Parameters<(typeof ga4events)[TEventName]>[0]
    `),

    factory.createSourceFile(
      [
        factory.createVariableStatement(
          [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                "ga4events",
                undefined,
                undefined,
                factory.createSatisfiesExpression(
                  factory.createAsExpression(
                    eventByName,
                    factory.createTypeReferenceNode(
                      factory.createIdentifier("const"),
                      undefined
                    )
                  ),
                  factory.createTypeReferenceNode(
                    factory.createIdentifier("EventFactory"),
                    [
                      factory.createTypeReferenceNode(
                        factory.createIdentifier("Record"),
                        [
                          factory.createKeywordTypeNode(
                            ts.SyntaxKind.StringKeyword
                          ),
                          factory.createTypeReferenceNode(
                            factory.createIdentifier("EventConfig"),
                            [
                              factory.createKeywordTypeNode(
                                ts.SyntaxKind.AnyKeyword
                              ),
                            ]
                          ),
                        ]
                      ),
                    ]
                  )
                )
              ),
            ],
            ts.NodeFlags.Const
          )
        ),
      ],
      factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    ),
  ];
}
