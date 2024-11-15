import { trim } from "lodash"

export function tokenizeItemLabel(item_label: string): ItemLabelTokens {
  item_label = item_label.toLocaleLowerCase()

  if (item_label.includes("/")) {
    console.warn(`Unsupported item_label: "${item_label}". Please edit manually`)
    return {
      staticPrefix: item_label,
      defaultParams: [],
      extraParams: [],
    } as const
  }

  const tokens = item_label
    .split(/(?=\$)/g)
    .filter((x) => x != "")
    .map((x) => trim(x, ` _"`))

  const staticPrefix = tokens[0].startsWith("$") ? undefined : tokens.shift()!
  const params = tokens.map((token) => trim(token, "$"))

  return {
    staticPrefix,
    defaultParams: params.filter(isDefaultParam),
    extraParams: params.filter((x) => !isDefaultParam(x)),
  } as const
}

export type ItemLabelTokens = {
  readonly staticPrefix: string | undefined
  readonly defaultParams: DefaultParam[]
  readonly extraParams: string[]
}

const defaultParams = new Set<DefaultParam>(["country", "provider"])

type DefaultParam = "country" | "provider"

function isDefaultParam(token: string): token is DefaultParam {
  return defaultParams.has(token as DefaultParam)
}
