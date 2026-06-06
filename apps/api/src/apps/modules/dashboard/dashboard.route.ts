import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Dashboard route placeholder" });
});

export default router;
