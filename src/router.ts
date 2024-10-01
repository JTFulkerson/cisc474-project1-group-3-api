import express from "express";
import { Controller } from "./controller";

export class ApiRouter {
    private router: express.Router = express.Router();
    private controller: Controller = new Controller();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.get("/leaderboard", this.controller.getLeaderboard);
        this.router.post("/leaderboard", this.controller.postLeaderboard);
        return this.router;
    }
}