import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { User, UserSchema } from "@workspace/types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express.js Monorepo API Server!" });
});

app.get("/users", (req, res) => {
  const users: User[] = [
    {
      id: "1",
      name: "Masrafi",
      email: "masrafi@example.com"
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com"
    }
  ];

  res.json(users);
});

// Example of request body validation using Zod schema from @workspace/types
app.post("/users", (req, res) => {
  const result = UserSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  const newUser: User = result.data;
  // Here you would typically save to DB
  res.status(201).json({ message: "User created successfully!", user: newUser });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
