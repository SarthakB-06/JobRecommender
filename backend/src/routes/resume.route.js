import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.js";
import { uploadResumeToCloudinary } from "../controllers/resume.controller.js";

const router = Router()

router.route("/upload-resume").post(verifyJWT , uploadResumeToCloudinary)


export default router