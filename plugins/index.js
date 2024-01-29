const path = require("path");
const fp = require("fastify-plugin");
const fastifyCookie = require("@fastify/cookie");
const fastifySession = require("@fastify/session");
const MongoStore = require("connect-mongo");

module.exports = fp(async function (app, opts) {

    app.register(fastifyCookie)
    app.register(fastifySession, {
        saveUninitialized: false,
        secret: "B6E6D2UvM5TKlLCHBZF6HGJ19RpPcw13",
        cookie: {
            maxAge: 20000,
            secure: "auto"
        },
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017",
            dbName: "loggedIn"
        })
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
    
});
