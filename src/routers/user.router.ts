import { Router } from "express";
import {
  createUser,
  getMe,
  getUsers,
  login,
  logout,
  refreshAccessToken,
  updateUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

export const userRouter = Router();

userRouter.post("/login", login);
userRouter.get("/refresh-token", refreshAccessToken);
userRouter.post("/new", authenticate, createUser);
userRouter.post("/logout", authenticate, logout);
userRouter.put("/", authenticate, updateUser);
userRouter.get("/me", authenticate, getMe);
userRouter.get("/all", authenticate, getUsers);
