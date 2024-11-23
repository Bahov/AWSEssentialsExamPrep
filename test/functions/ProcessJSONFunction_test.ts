// import { handler } from "../../src/ProcessJSONFunction";

// describe("ProcessJSONFunction test", () => {
//     test("Positive test", async () => {
//         expect(await handler(5)).toStrictEqual({
//             example: 5,
//         });
//     });
// });

// import { HttpMethod } from "aws-cdk-lib/aws-events";
// import { handler } from "../../src/ProcessJSONFunction";

// describe("ProcessJSONFunction test", () => {
//     test("should process JSON correctly", async () => {
//         // Test input JSON
//         const input = {
//             HttpMethod: "POST",
//             body: JSON.stringify({
//                 name: "John Doe",
//                 age: 30,
//                 city: "New York"
//             })
//         };

//         // Expected output JSON
//         const expectedOutput = {
//             message: "Processed JSON successfully",
//             data: {
//                 name: "John Doe",
//                 age: 30,
//                 city: "New York"
//             }
//         };

//         // Assert that the result matches the expected output
//         expect(await handler(input)).toEqual(expectedOutput);
//     });
// });