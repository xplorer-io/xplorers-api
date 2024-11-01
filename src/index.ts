import express from "express";
import authenticationRoutes from "./authentication/routes/authenticationRouter";
import eventsRoutes from "./events/routes/eventRoutes"

const router = express.Router();

router.use('', authenticationRoutes)
router.use('', eventsRoutes)

export default router