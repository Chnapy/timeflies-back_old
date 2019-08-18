import 'reflect-metadata';
import http from "http";
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import {monitor} from "@colyseus/monitor";
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {MyRoom} from "./MyRoom";
import {createConnection} from "typeorm";
import {AuthenticationController} from "./controllers/authentication/AuthenticationController";
import {Server} from "./Server";

createConnection().then(connection => {
    console.log('DB connection success !');
});

// const server = http.createServer(app);
// const gameServer = new Server({server});
//
// // register your room handlers
// gameServer.register('my_room', MyRoom);
//
//
// // register colyseus monitor AFTER registering your room handlers
// app.use("/colyseus", monitor(gameServer));
//
// gameServer.listen(port);
// console.log(`Listening on ws://localhost:${port}`);

const server = new Server();
server.start();