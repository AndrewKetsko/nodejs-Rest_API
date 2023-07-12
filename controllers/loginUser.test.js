const { loginUser } = require("./users");

  test("loginUser", async () => {
    const data = await loginUser();
    expect(data).toBe("");
  });



