import { factory } from "typescript"
import { ItemLabelTokens } from "../tokenize/tokenizeItemLabel"

export function create_itemLabel_StringLiteralExpression(tokens: ItemLabelTokens) {
  const staticPrefix = tokens.staticPrefix
  const params = [...tokens.extraParams, ...tokens.defaultParams.map((x) => (x === "country" ? "countryCode" : x))]

  switch (params.length) {
    case 0:
      return factory.createStringLiteral(staticPrefix ?? "")

    case 1:
      return factory.createTemplateExpression(factory.createTemplateHead(staticPrefix ? `${staticPrefix}_` : ""), [
        createTailSpan(params[0]),
      ])

    default:
      return factory.createTemplateExpression(
        factory.createTemplateHead(staticPrefix ? `${staticPrefix}_` : ""),
        params.map((item, index) => {
          const isLastItem = index == params.length - 1
          if (isLastItem) {
            return createTailSpan(item)
          }
          return createMiddleSpan(item)
        })
      )
  }
}

function createMiddleSpan(paramName: string) {
  return factory.createTemplateSpan(
    factory.createPropertyAccessExpression(factory.createIdentifier("params"), factory.createIdentifier(paramName)),
    factory.createTemplateMiddle("_")
  )
}

function createTailSpan(paramName: string) {
  return factory.createTemplateSpan(
    factory.createPropertyAccessExpression(factory.createIdentifier("params"), factory.createIdentifier(paramName)),
    factory.createTemplateTail("")
  )
}
