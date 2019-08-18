import {ServerLoader, ServerSettings, Inject, GlobalAcceptMimesMiddleware} from "ts-express-decorators";
import Path from "path";
import http from "http";
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import {monitor} from "@colyseus/monitor";
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {MyRoom} from "./MyRoom";
import {createConnection} from "typeorm";
import PassportLocalService from "./services/PassportLocalService";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    httpPort: Number(process.env.PORT || 2567),
    rootDir,
    mount: {
        '/': `${rootDir}/controllers/**/**.ts`
    },
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    @Inject()
    $onMountingMiddlewares(): void | Promise<any> {

        const passportService: PassportLocalService = this.injector.get<PassportLocalService>(PassportLocalService)!;

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cors())

            // Configure passport JS
            .use(passportService.middlewareInitialize())
            .use(passportService.middlewareSession());


    }

    $onReady(): void {
        console.debug('Server initialized')
    }

    $onServerInitError(error: Error): void {
        console.error('Server encounter an error =>', error);
    }
}