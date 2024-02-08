export default async (app, opts) => {
  app.get("/", async (req, res) => {
    return res.type("text/html").send("<h1>Hello World FROM CUSTOMER API</h1>");
  });
};
