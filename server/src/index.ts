import express from "express";
import cors from "cors";
import { apiRouter } from "./api";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
