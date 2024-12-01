import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = process.env.PORT || 5555;

app.use(express.json());

app.get("/api/listings", (req: Request, res: Response) => {
  
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});