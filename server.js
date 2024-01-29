const app = require("fastify")({ logger: true });
const connectDb = require("./config/db");
const AutoLoad = require("@fastify/autoload")
const path = require("path")

//GLOBAL MIDDLEWARES
app.register(AutoLoad, {
  dir: path.join(process.cwd(), "plugins"),
  opts: {}
});

//ROUTES
app.register(AutoLoad, {
  dir: path.join(process.cwd(), "routes"),
  opts: {}
});

app.setNotFoundHandler(function (request, reply) {
  return reply.view("404.ejs")
})

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
