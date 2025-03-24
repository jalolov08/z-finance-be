import { User } from "../models/user.model";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors";
import bcrypt from "bcrypt";

class UserService {
  async createUser(name: string, username: string, password: string) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new BadRequestError("Пользователь с таким логином уже существует.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    try {
      const savedUser = await newUser.save();

      const { password: _, ...userWithoutPassword } = savedUser.toObject();

      return userWithoutPassword;
    } catch (error) {
      console.error("Ошибка при регистрации пользователя:", error);
      throw new InternalServerError("Ошибка при регистрации пользователя.");
    }
  }

  async updateUser(
    userId: string,
    name?: string,
    username?: string,
    password?: string
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден.");
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new ForbiddenError(
          "Пользователь с таким логином уже существует."
        );
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (name) user.name = name;
    if (username) user.username = username;

    try {
      const updatedUser = await user.save();

      const { password: _, ...userWithoutPassword } = updatedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      throw new InternalServerError("Ошибка при обновлении пользователя.");
    }
  }

  async getUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден.");
    }

    return user;
  }

  async getUsers(currentUser: string) {
    try {
      const query: any = { _id: { $ne: currentUser } };

      const users = await User.find(query);

      const usersWithoutPassword = users.map((user) => {
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });

      return usersWithoutPassword;
    } catch (error) {
      console.error("Ошибка при получении списка пользователей:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
