import express from "express";
import { getSlackUserDetail } from "../controllers/fetchSlackUserCtrl";
import { checkSlackUserStatus } from "../controllers/fetchSlackUserStatusCtrl";


const router = express.Router();

router.get("/slack/user", getSlackUserDetail);
router.get("/slack/user/status", checkSlackUserStatus);

export default router