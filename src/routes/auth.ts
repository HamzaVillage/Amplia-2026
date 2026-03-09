import { Router } from "express";
import upload from "../middleware/multerConfig";
import { validate } from "../middleware/validate";
import { AuthController } from "../controllers/auth";
import { AuthValidation } from "../validations/auth";

const router = Router()

router.post('/signup/requestOtp', upload.single("profile"), AuthController.signupRequestOtp)

router.post('/signup/verifyOtp', AuthController.signupVerifyOtp)
router.post('/signup/resendOtp', AuthController.signupResendOtp)
router.post('/signin', AuthController.signin)

router.post('/fotgotPassword', AuthController.fotgotPassword)
router.post('/verifyOtp', AuthController.verifyOtp)
router.post('/resetPassword', AuthController.resetPassword)

export default router
