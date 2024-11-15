// import { describe, expect, it, jest } from "@jest/globals"
// import { tokenizeItemLabel } from "../tokenizeItemLabel"

// describe("tokenizeItemLabel", () => {
//   it("should return original item_label if it contains /", () => {
//     const consoleSpy = jest.spyOn(console, "warn")

//     const result = tokenizeItemLabel("enable_ai_button_$country_$provider / apply_changes_ai_button_$country_$provider")

//     expect(consoleSpy).toBeCalledTimes(1)
//     expect(result).toEqual({
//       staticPrefix: "enable_ai_button_$country_$provider / apply_changes_ai_button_$country_$provider",
//       defaultParams: [],
//       extraParams: [],
//     })
//   })

//   it("should parse staticPrefix and defaultParams", () => {
//     const result = tokenizeItemLabel("ai_table_heading_tooltip_$country_$provider")

//     expect(result).toEqual({
//       staticPrefix: "ai_table_heading_tooltip",
//       defaultParams: ["country", "provider"],
//       extraParams: [],
//     })
//   })

//   it("Should parse extraParams", () => {
//     const result = tokenizeItemLabel("replied_counter_$quantity_$country_$provider")

//     expect(result).toEqual({
//       staticPrefix: "replied_counter",
//       defaultParams: ["country", "provider"],
//       extraParams: ["quantity"],
//     })
//   })

//   it("Should parse empty staticPrefix", () => {
//     const result = tokenizeItemLabel("$country_$provider")

//     expect(result).toEqual({
//       staticPrefix: undefined,
//       defaultParams: ["country", "provider"],
//       extraParams: [],
//     })
//   })
// })
