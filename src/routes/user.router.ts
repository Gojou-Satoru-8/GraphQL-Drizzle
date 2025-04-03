import express from "express";
import * as userController from "@/controllers/user.controller";

const router = express.Router();
router.route("/").get(userController.getAllUsers).post(userController.insertUser);

export default router;
