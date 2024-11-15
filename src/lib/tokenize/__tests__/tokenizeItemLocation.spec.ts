// import { expect, it, test, describe, beforeEach, afterEach } from "@jest/globals"
// import { tokenizeItemState } from "../tokenizeItemState"
// import { tokenizeItemLocation } from "../tokenizeItemLocation"

// describe("tokenizeItemLocation", () => {
//   it("0", () => {
//     expect(tokenizeItemLocation("$report")).toEqual([
//       {
//         page: "$report",
//         type: "pageOnly",
//       },
//     ])
//   })

//   it("1", () => {
//     expect(tokenizeItemLocation("$report.empty_cra")).toEqual([
//       {
//         page: "$report",
//         type: "block",
//         block: "empty_cra",
//       },
//     ])
//   })

//   it("2", () => {
//     expect(tokenizeItemLocation("$report.empty_cra / $report.create_new_cra_modal")).toEqual([
//       {
//         page: "$report",
//         type: "block",
//         block: "empty_cra",
//       },
//       {
//         page: "$report",
//         type: "modal",
//         modal: "create_new_cra",
//       },
//     ])
//   })
// })
