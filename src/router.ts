import express from "express";
import { Controller } from "./controller";

// Authentication middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authCode = req.headers['x-auth-code'];
    const AUTH_CODE = process.env.AUTH_CODE;
    if (authCode === AUTH_CODE) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
};

export class ApiRouter {
    private router: express.Router = express.Router();
    private controller: Controller = new Controller();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.get("/leaderboard", authenticate, this.controller.getLeaderboard.bind(this.controller));
        this.router.post("/leaderboard", authenticate, this.controller.postLeaderboard.bind(this.controller));
        return this.router;
    }
}