import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { FileValidation } from "../validations/file";
import { FileController } from "../controllers/file";
import { validate } from "../middleware/validate";
import upload from "../middleware/multerConfig";

const router = Router()

router.route('/')
    .post(IsAuth.authenticated, upload.single("file"), FileController.add)
    .get(IsAuth.everyone, FileController.get)

router.route('/link')
    .post(IsAuth.authenticated, FileController.link);

router.route('/:id')
    .patch(IsAuth.everyone, upload.single("file"), FileController.update)
    .delete(IsAuth.admins, FileController.delete)
    .get(IsAuth.everyone, FileController.get)

export default router