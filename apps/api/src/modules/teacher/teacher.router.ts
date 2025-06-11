import { Router } from "express";
import { TeacherController } from "./teacher.controller";

const router = Router();
const teacherController = new TeacherController()

router.post('/', teacherController.handleCreate);
router.post('/list', teacherController.handleGetAll);
router.post('/details', teacherController.handleGetById);
router.put('/update', teacherController.handleUpdate);
router.delete('/delete', teacherController.handleDelete);

export const TeacherRouter = router;