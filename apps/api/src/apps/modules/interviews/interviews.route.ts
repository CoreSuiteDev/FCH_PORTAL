import { Router } from "express";

const router:Router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Interviews route placeholder" });
});

export default router;
