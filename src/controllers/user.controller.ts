import {
  Request,
  Response,
  // NextFunction
} from "express";
import * as userService from "../services/user.service";

// NOTE: these are the default types of express middlewares:
// export const getAllUsers = async (req: Request, res: Response, next: NextFunction)

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const results = await userService.getAllUsers();
    const statusGroupBy = await userService.statusGroupBy();
    const ageGroupBy = await userService.ageGroupBy();

    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      count: results.length,
      users: results,
      statusGroupBy,
      ageGroupBy,
    });
  } catch (error) {
    console.error("🚀 ~ getAllUsers ~ error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = +req.params.id;
  const user = await userService.getUserById(userId);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  return res.status(200).json({ success: true, message: "User retrieved successfully", user });
};

export const insertUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userService.insertUser(req.body);
    const newUserPreferences = await userService.insertUserPreferences(newUser?.id as number);

    return res.status(201).json({
      success: true,
      message: "New user created successfully",
      user: newUser,
      preferences: newUserPreferences,
    });
  } catch (error) {
    console.error("🚀 ~ insertUser ~ error:", error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed up insert",
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userId = +req.params.id;
  try {
    const updatedUser = await userService.updateUserById(userId, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    return res
      .status(200)
      .json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error: unknown) {
    console.error("🚀 ~ updateUserById ~ error:", error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = +req.params.id;
  const deletedUser = await userService.deleteUserById(userId);

  if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });
  return res
    .status(200)
    .json({ success: true, message: "User deleted successfully", user: deletedUser });
};
