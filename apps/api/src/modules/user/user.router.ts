// src/modules/user/user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRole } from './user.model';
import { authenticate } from '@src/auth/auth.middleware';
import { authorizeRole } from '@src/auth/authorizeRole';

const router = Router();
const userController = new UserController();

/**
 *  PUBLIC ROUTES (No Auth Required)
 */
    router.post('/register', userController.createUser);
    router.post('/login', userController.verifyLogin);
    router.post('/check-email', userController.checkEmailAvailability); 

/**
 *  AUTHENTICATED ROUTES (Any Logged-In User)
 */
router.post('/details',  userController.getUserById);
router.patch('/:_id/update-password', authenticate, userController.updatePassword);

/**
 *  AUTHORIZED USER ROUTES (USER, ADMIN, etc.)
 */
router.post('/list', userController.getAllUsers);
router.post('/search/query', authenticate, authorizeRole(UserRole.ADMIN, UserRole.MANAGER), userController.searchUsers);
router.post('/active/list', authenticate, authorizeRole(UserRole.ADMIN), userController.getActiveUsers);
router.post('/admin/list', authenticate, authorizeRole(UserRole.ADMIN), userController.getAdminUsers);
router.post('/role/:role', authenticate, authorizeRole(UserRole.ADMIN), userController.getUsersByRole);
router.post('/stats/overview', authenticate, authorizeRole(UserRole.ADMIN), userController.getUserStats);

router.put('/:_id', authenticate, authorizeRole(UserRole.ADMIN), userController.updateUser);
router.delete('/:_id', authenticate, authorizeRole(UserRole.ADMIN), userController.deleteUser);
router.patch('/:_id/toggle-status', authenticate, authorizeRole(UserRole.ADMIN), userController.toggleUserStatus);
router.patch('/:_id/change-role', authenticate, authorizeRole(UserRole.ADMIN), userController.changeUserRole);

// Optional
// router.post('/bulk/deactivate', authenticate, authorizeRole(UserRole.ADMIN), userController.bulkDeactivateUsers);

export const UserRouter = router;
