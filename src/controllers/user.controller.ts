import { Request, Response } from "express";
import { validateFields } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";

export const login = [
  validateFields(["username", "password"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const { accessToken, refreshToken, user } = await authService.login(
      username,
      password
    );

    res.status(200).json({
      accessToken,
      refreshToken,
      user,
    });
  }),
];
export const createUser = [
  validateFields(["name", "username", "password"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, username, password, role } = req.body;

    const user = await userService.createUser(name, username, password);

    res.status(201).json({
      user,
    });
  }),
];
export const logout = [
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    await authService.logout(userId);

    res.status(200).json({
      message: "Выход из системы успешен",
    });
  }),
];
export const updateUser = [
  asyncHandler(async (req: Request, res: Response) => {
    const { name, username, password } = req.body;
    const userId = req.user._id;

    const updatedUser = await userService.updateUser(
      userId,
      name,
      username,
      password
    );

    res.status(200).json({
      message: "Пользователь успешно обновлён",
      user: updatedUser,
    });
  }),
];
export const refreshAccessToken = [
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.query;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(refreshToken.toString());

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  }),
];
export const getMe = [
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    const user = await userService.getUser(userId);
    res.status(200).json(user);
  }),
];
export const getUsers = [
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const role = req.query.role;
    const users = await userService.getUsers(userId);
    res.status(200).json(users);
  }),
];
