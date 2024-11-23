// import { handler } from "../../src/ProcessJSONFunction";

// describe("ProcessJSONFunction test", () => {
//     test("Positive test", async () => {
//         expect(await handler(5)).toStrictEqual({
//             example: 5,
//         });
//     });
// });

import { handler } from "../../src/ProcessJSONFunction";

describe("ProcessJSONFunction test", () => {
    it("should process JSON correctly", () => {
        // Test input JSON
        const input = {
            name: "John Doe",
            age: 30,
            city: "New York"
        };

        // Expected output JSON
        const expectedOutput = {
            message: "Processed JSON successfully",
            data: {
                name: "John Doe",
                age: 30,
                city: "New York"
            }
        };

        // Call the handler function
        const result = handler(input);

        // Assert that the result matches the expected output
        expect(result).toEqual(expectedOutput);
    });
});