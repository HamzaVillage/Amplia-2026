import { Router } from "express";
import { taxCategoryController } from "../controllers/taxCategory";

const router = Router();

router.get("/", taxCategoryController.getAll);
router.post("/", taxCategoryController.create);
router.put("/:id", taxCategoryController.update);
router.delete("/:id", taxCategoryController.delete);
router.post("/calculate", taxCategoryController.calculate);

export default router;
