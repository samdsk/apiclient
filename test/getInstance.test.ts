import getInstance, { sleep } from "../src/authentication";

describe("AxiosGetInstance", () => {
    it("get new axios instance with token", async () => {
        const instance = await getInstance("sam", "password");
        expect(instance.defaults.headers.Authorization).toMatch(/^Bearer/)
    })
});

describe("AxiosRequestForNewTokenWhenExpires", () => {
    it("axios should ask for a new bearer token when expires current one", async () => {
        const instance = await getInstance("sam", "password");
        const oldToken = instance.defaults.headers.Authorization;

        await sleep(6000);        
        await instance.get("/projects");

        expect(instance.defaults.headers.Authentication).not.toEqual(oldToken);
    },7000)
});