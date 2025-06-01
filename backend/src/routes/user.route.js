import { Router } from "express";
import { getUserProfile, markResumeUploaded, userLogin, userRegister , userLogout } from "../controllers/user.controller.js";
// import verifyJWT from "../middlewares/authentication.js";
import { verifyJWT } from "../middlewares/authentication.js";
// import { uploadResumeToCloudinary } from "../controllers/resume.controller.js";

const router = Router();

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/me").get(verifyJWT , getUserProfile )
router.route('/logout').post(verifyJWT , userLogout)

router.route("/resume-uploaded").post(verifyJWT , markResumeUploaded)



export default router; 