import getInstance, { sleep } from "../src/authentication";

describe("AxiosGetInstance", () => {
    it("get new axios instance with token", async () => {
        const instance = await getInstance("sam", "password");
        expect(instance.defaults.headers.Authorization).toMatch(/^Bearer/)
    })
})