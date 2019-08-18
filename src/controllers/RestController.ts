import {Controller, Get, RouteService} from "ts-express-decorators";

@Controller("/rest")
export class RestController {

    constructor(private routeService: RouteService) {
    }

    @Get("/")
    public getRoutes() {
        return this.routeService.getAll();
    }
}