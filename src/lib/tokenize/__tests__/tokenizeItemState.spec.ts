// import { expect, it, test, describe, beforeEach, afterEach } from "@jest/globals"
// import { tokenizeItemState } from "../tokenizeItemState"

// describe("tokenizeItemState", () => {
//   it("should remove $ from state", () => {
//     expect(tokenizeItemState("$language")).toEqual([{ name: "state", options: ["language"] }])
//   })

//   it("should split simple state by /", () => {
//     expect(tokenizeItemState("project / local / static")).toEqual([{ name: "state", options: ["project", "local", "static"] }])
//   })

//   it("it should spit state variants by . then by /", () => {
//     expect(tokenizeItemState("{single / many}.{premium / basic}")).toEqual([
//       { name: "state1", options: ["single", "many"] },
//       { name: "state2", options: ["premium", "basic"] },
//     ])
//   })

//   it("should add text to option if it's outside of {}", () => {
//     expect(tokenizeItemState("positive {off / on}.negative {off / on}")).toEqual([
//       { name: "state1", options: ["positive off", "positive on"] },
//       { name: "state2", options: ["negative off", "negative on"] },
//     ])
//   })

//   it("should parse option with no variants as is", () => {
//     expect(tokenizeItemState("{with gbp / without gbp}.{limits N}")).toEqual([
//       { name: "state1", options: ["with gbp", "without gbp"] },
//       { name: "state2", options: ["limits N"] },
//     ])
//   })
// })
