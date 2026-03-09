import { Router } from "express";
import { ServiceController } from "../controllers/service";

const router = Router();

router.route('/')
    .get(ServiceController.get);

router.route('/:id')
    .get(ServiceController.getById);

export default router;
