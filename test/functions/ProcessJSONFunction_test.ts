import { handler } from "../../src/ProcessJSONFunction";

describe("ProcessJSONFunction test", () => {
    test("Positive test", async () => {
        expect(await handler(5)).toStrictEqual({
            example: 5,
        });
    });
});