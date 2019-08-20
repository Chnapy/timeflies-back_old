import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import '@tsed/typeorm';
import Path from "path";
import methodOverride from 'method-override';
import cors from 'cors';
import bodyParser from 'body-parser';
// import {monitor} from "@colyseus/monitor";
// import {MyRoom} from "./MyRoom";
import {ORMCONFIG} from "./TypeORMSetup";
import session from "express-session";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    debug: true,
    httpPort: Number(process.env.PORT || 2567),
    httpsPort: false,
    rootDir,
    mount: {
        '/rest': `${rootDir}/controllers/**/**.ts`
    },
    componentsScan: [
        `${rootDir}/middlewares/**/**.ts`,
        `${rootDir}/services/**/**.ts`,
    ],
    acceptMimes: ["application/json"],
    typeorm: [
        ORMCONFIG
    ]
})
export class Server extends ServerLoader {

    $onMountingMiddlewares(): void | Promise<any> {

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(session({
                secret: "mysecretkey",
                resave: true,
                saveUninitialized: true,
                cookie: {
                    path: "/",
                    httpOnly: true,
                    secure: false
                }
            }))
            .use(cors());


    }

    $onReady(): void {
        console.debug('Server initialized')
    }

    $onServerInitError(error: Error): void {
        console.error('Server encounter an error =>', error);
    }
}