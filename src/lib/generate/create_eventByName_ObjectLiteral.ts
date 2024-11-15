import { snakeCase } from "lodash";
import ts, { factory } from "typescript";
import { tokenizeInput } from "../tokenize/tokenizeInput";
import { isNotNullable } from "../utils";
import { create_itemLabel_StringLiteralExpression } from "./create_itemLabel_StringLiteralExpression";
import { create_itemLocation_Initializer } from "./create_itemLocation_Initializer";

export function create_eventByName_ObjectLiteral({
  tokens,
  reportName,
}: {
  tokens: ReturnType<typeof tokenizeInput>;
  reportName: string;
}): ts.ObjectLiteralExpression {
  const eventByName = factory.createObjectLiteralExpression(
    tokens.map(
      ({
        eventId,
        eventName,
        itemLabel,
        itemLocation,
        state,
        status,
        type,
      }) => {
        const blockList = itemLocation
          .filter((p) => p.type === "block")
          .map((x) => x.block!);
        const modalList = itemLocation
          .filter((p) => p.type === "modal")
          .map((x) => x.modal!);
        const pagesSet = new Set(itemLocation.map((x) => x.page));

        const extraPropertiesTypeLiteral = [
          blockList.length > 1
            ? factory.createPropertySignature(
                undefined,
                factory.createIdentifier("block"),
                undefined,
                factory.createUnionTypeNode(
                  blockList.map((block) =>
                    factory.createLiteralTypeNode(
                      factory.createStringLiteral(block)
                    )
                  )
                )
              )
            : undefined,

          modalList.length > 1
            ? factory.createPropertySignature(
                undefined,
                factory.createIdentifier("modal"),
                undefined,
                factory.createUnionTypeNode(
                  modalList.map((modal) =>
                    factory.createLiteralTypeNode(
                      factory.createStringLiteral(modal)
                    )
                  )
                )
              )
            : undefined,

          ...(state.length > 0
            ? state.map(({ name, options }) =>
                factory.createPropertySignature(
                  undefined,
                  factory.createIdentifier(name),
                  undefined,
                  factory.createUnionTypeNode(
                    options.map((block) =>
                      factory.createLiteralTypeNode(
                        factory.createStringLiteral(block)
                      )
                    )
                  )
                )
              )
            : []),

          ...(itemLabel.extraParams.length > 0
            ? itemLabel.extraParams.map((token) => {
                return factory.createPropertySignature(
                  undefined,
                  factory.createIdentifier(snakeCase(token)),
                  undefined,
                  factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
                );
              })
            : []),

          pagesSet.size > 1
            ? factory.createPropertySignature(
                undefined,
                factory.createIdentifier("page"),
                undefined,
                factory.createUnionTypeNode(
                  Array.from(pagesSet).map((page) =>
                    factory.createLiteralTypeNode(
                      factory.createStringLiteral(page)
                    )
                  )
                )
              )
            : undefined,

          type != null && type !== ""
            ? factory.createPropertySignature(
                undefined,
                factory.createIdentifier("type"),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
              )
            : undefined,
        ].filter(
          (x: ts.PropertySignature | undefined): x is ts.PropertySignature =>
            x !== undefined
        );

        const typeParams = factory.createTypeReferenceNode(
          factory.createIdentifier("EventConfig"),
          [
            extraPropertiesTypeLiteral.length > 0
              ? factory.createTypeLiteralNode(extraPropertiesTypeLiteral)
              : factory.createTypeReferenceNode(
                  factory.createIdentifier("EMPTY_EXTRA_PROPS")
                ),
          ]
        );

        return factory.createPropertyAssignment(
          eventId,
          factory.createFunctionExpression(
            undefined,
            undefined,
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                "params",
                undefined,
                typeParams,
                undefined
              ),
            ],
            undefined,
            factory.createBlock([
              factory.createReturnStatement(
                factory.createObjectLiteralExpression([
                  factory.createPropertyAssignment(
                    "event",
                    factory.createStringLiteral(eventName)
                  ),
                  factory.createPropertyAssignment(
                    "eventProperties",
                    factory.createObjectLiteralExpression(
                      [
                        factory.createPropertyAssignment(
                          "item_name",
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier("params"),
                            factory.createIdentifier("locationName")
                          )
                        ),

                        factory.createPropertyAssignment(
                          "item_label",
                          create_itemLabel_StringLiteralExpression(itemLabel)
                        ),

                        factory.createPropertyAssignment(
                          "item_location",
                          create_itemLocation_Initializer({
                            reportName,
                            tokens: itemLocation,
                          })
                        ),

                        state.length > 0
                          ? factory.createPropertyAssignment(
                              "state",
                              create_itemLabel_StringLiteralExpression({
                                staticPrefix: undefined,
                                defaultParams: [],
                                extraParams: state.flatMap((x) => x.name),
                              })
                            )
                          : undefined,

                        type != null && type !== ""
                          ? factory.createPropertyAssignment(
                              "type",
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier("params"),
                                factory.createIdentifier("type")
                              )
                            )
                          : undefined,

                        status != ""
                          ? factory.createPropertyAssignment(
                              "status",
                              factory.createStringLiteral(status)
                            )
                          : undefined,
                      ].filter(isNotNullable)
                    )
                  ),
                ])
              ),
            ])
          )
        );
      }
    )
  );

  return eventByName;
}
