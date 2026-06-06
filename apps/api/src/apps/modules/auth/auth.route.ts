import { Router } from "express";

const router:Router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Auth route placeholder" });
});

export default router;
