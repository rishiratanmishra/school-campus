import { Router } from 'express';
import { StudentController } from './student.controller';

const router = Router();
const studentController = new StudentController(); 

router.post('/list', studentController.handleGetAll);
router.post('/details', studentController.handleGetById);
router.post('/', studentController.handleCreate);
router.put('/:_id', studentController.handleUpdate);
router.delete('/:_id', studentController.handleDelete);

export default router;
