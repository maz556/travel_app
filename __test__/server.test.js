import supertest from "supertest";
import app from "../src/server/server";

const request = supertest(app);

it("Gets the test endpoint", async (done) => {
    // Sends GET Request to /test endpoint
    const resp = await request.get("/test");
    expect(resp.status).toBe(200);
    expect(resp.body.msg).toBe("This is a test response");
    done();
});
