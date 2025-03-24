import express, { Request, Response } from "express";
import { port } from "./config";
import { connectToDb } from "./utils/connectToDb";
import cors from "cors";
import { router } from "./routers/router";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

connectToDb();

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Сервер работает :)");
});

app.use("/api", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
