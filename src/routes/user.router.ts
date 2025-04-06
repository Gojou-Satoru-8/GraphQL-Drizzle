import express from "express";
import * as userController from "@/controllers/user.controller";

const router = express.Router();
router.route("/").get(userController.getAllUsers).post(userController.insertUser);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

export default router;
