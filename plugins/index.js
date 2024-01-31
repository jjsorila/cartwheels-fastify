const path = require("path");
const fp = require("fastify-plugin");
const fastifyCookie = require("@fastify/cookie");
const fastifySession = require("@fastify/session");
const jwt = require("@fastify/jwt")
const MongoStore = require("connect-mongo");

module.exports = fp(async function (app, options) {

    app.register(fastifyCookie)
    app.register(fastifySession, {
        saveUninitialized: false,
        secret: "B6E6D2UvM5TKlLCHBZF6HGJ19RpPcw13",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            secure: "auto"
        },
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017",
            dbName: "cartwheels",
            collectionName: "sessions"
        })
    })

    app.register(jwt, {
        secret: "B6E6D2UvM5TKlLCHBZF6HGJ19RpPcw13",
        sign: {
            algorithm: "HS256",
            expiresIn: "24h"
        }
    })
    
    app.register(require("@fastify/static"), {
        root: path.resolve(process.cwd(), "public"),
        prefix: "/public",
    });

    app.register(require("@fastify/view"), {
        engine: {
            ejs: require("ejs"),
        },
        root: path.resolve(process.cwd(), "views"),
    });

    app.addHook("preHandler", async(request, reply) => {
        reply.headers({
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        })
    })
    
});
