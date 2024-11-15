import { ts } from "ts-morph";
import { factory } from "typescript";
import { ItemLocationToken } from "../tokenize/tokenizeItemLocation";
import { isNotNullable } from "../utils";

export function create_itemLocation_Initializer({
  tokens,
  reportName,
}: {
  tokens: ItemLocationToken[];
  reportName: string;
}): ts.StringLiteral | ts.CallExpression {
  switch (tokens.length) {
    case 0:
    case undefined:
      console.warn("Warning! Unexpected empty item_location");
      return factory.createStringLiteral("EMPTY_LOCATION");
    case 1:
      return getSingleLocation_Initializer({
        dataPathArguments: tokens[0],
        reportName,
      });
    default:
      return getMultipleLocations_Initializer(tokens);
  }
}

function getSingleLocation_Initializer({
  dataPathArguments,
  reportName,
}: {
  dataPathArguments: ItemLocationToken;
  reportName: string;
}) {
  if (dataPathArguments.type === "pageOnly") {
    return factory.createCallExpression(
      factory.createIdentifier("generateStringDataPath"),
      undefined,
      [
        factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier("page"),
              factory.createStringLiteral(reportName)
            ),
          ],
          true
        ),
      ]
    );
  }

  return factory.createCallExpression(
    factory.createIdentifier("generateStringDataPath"),
    undefined,
    [
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier("page"), //
            factory.createStringLiteral(reportName)
          ),
          dataPathArguments.type === "pageWithStart"
            ? factory.createPropertyAssignment(
                factory.createIdentifier("type"),
                factory.createIdentifier("params.GALabel")
              )
            : undefined,
          dataPathArguments.type === "modal"
            ? factory.createPropertyAssignment(
                factory.createIdentifier("modal"),
                factory.createStringLiteral(dataPathArguments.modal)
              )
            : undefined,
          dataPathArguments.type === "block"
            ? factory.createPropertyAssignment(
                factory.createIdentifier("block"),
                factory.createStringLiteral(dataPathArguments.block)
              )
            : undefined,
        ].filter(isNotNullable),
        true
      ),
    ]
  );
}

function getMultipleLocations_Initializer(paths: ItemLocationToken[]) {
  let blocks: string[] | undefined = paths
    .filter((p) => p.type === "block")
    .map((x) => x.block!);
  if (blocks.length === 0) {
    blocks = undefined;
  }
  let modals: string[] | undefined = paths
    .filter((p) => p.type === "modal")
    .map((x) => x.modal!);
  if (modals.length === 0) {
    modals = undefined;
  }

  return factory.createCallExpression(
    factory.createIdentifier("generateStringDataPath"),
    undefined,
    [
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier("page"),
            factory.createStringLiteral("dashboard.review-analytics")
          ),
          blocks
            ? factory.createPropertyAssignment(
                factory.createIdentifier("block"),
                factory.createPropertyAccessExpression(
                  factory.createIdentifier("params"),
                  factory.createIdentifier("block")
                )
              )
            : undefined,
          modals
            ? factory.createPropertyAssignment(
                factory.createIdentifier("modal"),
                factory.createPropertyAccessExpression(
                  factory.createIdentifier("params"),
                  factory.createIdentifier("modal")
                )
              )
            : undefined,
        ].filter(isNotNullable),
        true
      ),
    ]
  );
}
