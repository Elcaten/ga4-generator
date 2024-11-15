import { trim } from "lodash"

export function tokenizeItemState(state: string): ItemStateToken[] {
  if (state == null || state == "") {
    return []
  }

  state = state.toLocaleLowerCase()

  const dotChunks = state.split(".").map(trim)

  return dotChunks.map((dotChunk, index) => {
    const dotChunkHasOptions = dotChunk.includes("{")

    if (!dotChunkHasOptions) {
      return { name: "state", options: dotChunk.split("/").map((option) => trim(option, "$ ")) }
    }

    const name = dotChunks.length === 1 ? "state" : `state${index + 1}`

    const regexGroups = new RegExp(`(?<${PREFIX}>.*)(?<${OPTIONS}>{.*})`).exec(dotChunk)?.groups

    if (regexGroups == null) {
      throw new Error(`Invalid state: ${dotChunk}`)
    }

    const prefix = regexGroups[PREFIX].trim()
    const slashChunks = regexGroups[OPTIONS].split("/").map((option) => trim(option, "{} "))

    if (prefix == "") {
      return { name, options: slashChunks }
    } else {
      return { name, options: slashChunks.map((option) => `${prefix} ${option}`) }
    }
  })
}

const PREFIX = "prefix"
const OPTIONS = "options"

interface ItemStateToken {
  name: string
  options: string[]
}
