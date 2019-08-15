import http from "http";
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import {Server} from "colyseus";
import {monitor} from "@colyseus/monitor";
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {MyRoom} from "./MyRoom";

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy((username, password, done) => {

    if (!username || !password) {
        return done(true);
    }

    done(null, {id: 1, username, password});

}));

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const gameServer = new Server({server});

// register your room handlers
gameServer.register('my_room', MyRoom);

app.use(cors());

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

app.post('/authenticate',
    passport.authenticate('local'),
    (req, res) => {

        res.json(req.user);
    });

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
