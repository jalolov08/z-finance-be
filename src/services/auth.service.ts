import { User } from "../models/user.model";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service";
import { Types } from "mongoose";

class AuthService {
  async login(username: string, password: string) {
    try {
      if (!username || !password) {
        throw new ForbiddenError("Логин и пароль обязательны");
      }

      const user = await User.findOne({ username });
      if (!user) {
        throw new NotFoundError("Пользователь с таким логином не найден");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenError("Неверный пароль");
      }

      let accessToken, refreshToken;
      try {
        accessToken = tokenService.generateAccessToken(
          user.username,
          (user._id as Types.ObjectId).toString()
        );
        refreshToken = await tokenService.generateRefreshToken(
          user.username,
          (user._id as Types.ObjectId).toString()
        );
      } catch (error) {
        console.error("Ошибка при генерации токенов:", error);
        throw new InternalServerError("Ошибка при генерации токенов");
      }

      const { password: _, ...userWithoutPassword } = user.toObject();
      return { accessToken, refreshToken, user: userWithoutPassword };
    } catch (error: any) {
      console.error("Ошибка при входе в систему:", error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = await tokenService.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded._id);

      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }

      const accessToken = tokenService.generateAccessToken(
        user.username,
        (user._id as Types.ObjectId).toString()
      );
      const newRefreshToken = await tokenService.generateRefreshToken(
        user.username,
        (user._id as Types.ObjectId).toString()
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error("Ошибка при обновлении access токена:", error);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      const result = await tokenService.deleteRefreshToken(userId);
      if (!result) {
        throw new InternalServerError("Ошибка при выходе");
      }
      return result;
    } catch (error: any) {
      console.error("Ошибка при выходе:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
