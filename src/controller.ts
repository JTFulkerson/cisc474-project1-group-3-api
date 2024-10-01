import express from "express";
import fs from "fs";
import path from "path";

const leaderboardFilePath = path.join(__dirname, "../data/leaderboard.json");

// Helper function to read leaderboard from file
const readLeaderboard = (): { name: string; score: number; ordersComplete: number }[] => {
    try {
        const data = fs.readFileSync(leaderboardFilePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading leaderboard file:", err);
        return [];
    }
};

// Helper function to write leaderboard to file
const writeLeaderboard = (leaderboard: { name: string; score: number; ordersComplete: number }[]): void => {
    try {
        fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard, null, 2), "utf8");
    } catch (err) {
        console.error("Error writing to leaderboard file:", err);
    }
};

export class Controller {
    // Get leaderboard
    public getLeaderboard(req: express.Request, res: express.Response): void {
        const topX = parseInt(req.query.top as string, 10);
        const leaderboard = readLeaderboard();
    
        if (!isNaN(topX) && topX > 0) {
            res.json(leaderboard.slice(0, topX));
        } else {
            res.json(leaderboard);
        }
    }

    // Push to leaderboard
    public postLeaderboard(req: express.Request, res: express.Response): void {
        const { name, score, ordersComplete } = req.body;
        if (name && score !== undefined && ordersComplete !== undefined) {
            const leaderboard = readLeaderboard();
            // Insert the new entry in the correct position based on the score
            const newEntry = { name, score, ordersComplete };
            let inserted = false;
    
            for (let i = 0; i < leaderboard.length; i++) {
                if (score > leaderboard[i].score) {
                    leaderboard.splice(i, 0, newEntry);
                    inserted = true;
                    break;
                }
            }
    
            if (!inserted) {
                leaderboard.push(newEntry);
            }

            writeLeaderboard(leaderboard);
    
            res.status(201).send('Entry added');
        } else {
            res.status(400).send('Invalid data');
        }
    }
}