const app = require("fastify")({ logger: true });
const connectDb = require("./config/db");

//GLOBAL MIDDLEWARES
app.register(require("./middlewares/index"));

//ROUTES
app.register(require("./routes/index"));

const start = async () => {
  try {
    await connectDb();
    await app.listen({ port: 5000 });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
