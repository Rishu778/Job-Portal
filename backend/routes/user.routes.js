import express from 'express'
import { login, logout, register, updateProfile } from '../controllers/user.controller.js';
import isaAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isaAuthenticated,singleUpload,updateProfile);

export default router;