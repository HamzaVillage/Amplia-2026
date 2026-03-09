import { Router } from "express";
import { CategoryController } from "../controllers/category";

const router = Router();

router.route('/')
    .get(CategoryController.get);

export default router;
