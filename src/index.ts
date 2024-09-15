import express from "express";
import authenticationRoutes from "./authentication/routes/authenticationRouter";
import eventsRoutes from "./events/routes/eventRoutes"

const router = express.Router();

router.use('', authenticationRoutes)
router.use('/events', eventsRoutes)

export default router