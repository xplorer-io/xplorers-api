import express from "express";
import { getSlackUserDetail } from "../controllers/fetchSlackUser";
import { checkSlackUserStatus } from "../controllers/fetchSlackUserStatus";


const router = express.Router();

router.get("/slack/user", getSlackUserDetail);
router.get("/slack/user/status", checkSlackUserStatus);

export default router