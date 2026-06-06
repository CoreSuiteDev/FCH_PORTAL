import { Router } from "express";
import authRouter from "../apps/modules/auth/auth.route.js";
import userRouter from "../apps/modules/user/user.route.js";
import dashboardRouter from "../apps/modules/dashboard/dashboard.route.js";
import moviesRouter from "../apps/modules/movies/movies.route.js";
import interviewsRouter from "../apps/modules/interviews/interviews.route.js";

const router:Router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/dashboard", dashboardRouter);
router.use("/movies", moviesRouter);
router.use("/interviews", interviewsRouter);

export default router;