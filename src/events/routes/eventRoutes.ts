import express from "express"
import { getEvents } from "../controllers/getEvents"

const router = express.Router()

router.get("/getEvents", getEvents);

export default router