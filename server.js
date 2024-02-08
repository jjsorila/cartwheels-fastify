import fastify from "fastify";
import { config } from "dotenv";
import connectDb from "./config/db.js"
import AutoLoad from '@fastify/autoload'
import path from 'path'
config({ path: path.resolve(process.cwd(),".env") })
const app = fastify({ 
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss tt',
        ignore: 'pid,hostname',
      }
    }
  }, 
  disableRequestLogging: true 
});

//GLOBAL PLUGINS
app.register(AutoLoad, {
  dir: path.join(process.cwd(), "plugins")
});

//ROUTES
app.register(AutoLoad, {
  dir: path.join(process.cwd(), "routes")
});

//404 NOT FOUND PAGE
app.setNotFoundHandler(async(request, reply) => {
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