import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "@tsed/common";
import '@tsed/typeorm';
import Path from "path";
import methodOverride from 'method-override';
import cors from 'cors';
import bodyParser from 'body-parser';
// import {monitor} from "@colyseus/monitor";
// import {MyRoom} from "./MyRoom";
import {PassportLocalService} from "./services/PassportLocalService";

const ormconfig_dev = require('../ormconfig-dev.json');
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
        ormconfig_dev
    ]
})
export class Server extends ServerLoader {


    $onMountingMiddlewares(): void | Promise<any> {

        // FIXME service is not injected if given in the constructor !
        const passportService: PassportLocalService = this.injector.get<PassportLocalService>(PassportLocalService)!;

        // We can see PassportLocalService and TypeORMService
        console.log(
            'All injectable:',
            this.injector.toArray().map(c => c.constructor.name)
        );

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(methodOverride())
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