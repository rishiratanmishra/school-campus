import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const userController = new UserController();

router.post('/', userController.createUser);

router.post('/list', userController.getAllUsers);

router.post('/details', userController.getUserById);

router.put('/:_id', userController.updateUser);

router.delete('/:_id', userController.deleteUser);

router.post('/active/list', userController.getActiveUsers);

router.post('/admin/list', userController.getAdminUsers);

router.post('/role/:role', userController.getUsersByRole);

router.post('/search/query', userController.searchUsers);

router.post('/stats/overview', userController.getUserStats);

router.post('/email/check', userController.checkEmailAvailability);

router.patch('/:_id/toggle-status', userController.toggleUserStatus);

router.patch('/:_id/change-role', userController.changeUserRole);

router.patch('/:_id/update-password', userController.updatePassword);

router.post('/verify/login', userController.verifyLogin);

// router.post('/bulk/deactivate', userController.bulkDeactivateUsers);

export const UserRouter = router;
