import path from 'path'
import fp from "fastify-plugin";
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyJwt from '@fastify/jwt';
import MongoStore from 'connect-mongo';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import ejs from 'ejs'

export default fp(async function (app, options) {

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

    app.register(fastifyJwt, {
        secret: "B6E6D2UvM5TKlLCHBZF6HGJ19RpPcw13",
        sign: {
            algorithm: "HS256",
            expiresIn: "24h"
        }
    })
    
    app.register(fastifyStatic, {
        root: path.resolve(process.cwd(), "public"),
        prefix: "/public",
    });

    app.register(fastifyView, {
        engine: {
            ejs: ejs,
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
