import express from "express";
import cors from "cors";
import { fetchSlackUserRoute, fetchSlackUserStatusRoute } from "./slackUser";

const app = express();
app.use(cors());

app.get("/slack/user", fetchSlackUserRoute);
app.get("/slack/user/status", fetchSlackUserStatusRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
