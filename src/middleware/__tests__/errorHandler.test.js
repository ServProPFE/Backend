const { errorHandler } = require("../errorHandler");

describe("errorHandler", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("returns the provided status code and message", () => {
    process.env.NODE_ENV = "test";

    const err = new Error("Validation failed");
    err.statusCode = 400;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation failed",
        stack: expect.any(String),
      })
    );
  });

  it("hides the stack trace in production", () => {
    process.env.NODE_ENV = "production";

    const err = new Error("Unexpected failure");
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unexpected failure",
    });
  });
});