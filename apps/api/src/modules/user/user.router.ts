import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();

// Basic CRUD operations
router.post('/', userController.handleCreate);
router.post('/create-advanced', userController.createUserAdvanced);
router.post('/list', userController.handleGetAll);
router.post('/list-advanced', userController.getAllUsersAdvanced);
router.post('/details', userController.handleGetById);
router.put('/:id', userController.handleUpdate);
router.delete('/:id', userController.handleDelete);

// User filtering and searching
router.post('/active', userController.getActiveUsers);
router.post('/inactive', userController.getInactiveUsers);
router.post('/by-role', userController.getUsersByRole);
router.post('/search', userController.searchUsers);
router.post('/advanced-filter', userController.advancedFilter);

// User-specific operations
router.post('/by-email', userController.getUserByEmail);
router.post('/by-domain', userController.getUsersByEmailDomain);
router.post('/recent', userController.getRecentUsers);

// Password and status management
router.post('/update-password', userController.updatePassword);
router.post('/validate-password', userController.validatePassword);
router.post('/toggle-status', userController.toggleUserStatus);

// Bulk operations
router.post('/bulk-activate', userController.bulkActivateUsers);
router.post('/bulk-deactivate', userController.bulkDeactivateUsers);

// Analytics and export
router.get('/stats', userController.getUserStats);
// router.post('/export', userController.exportUsers);

export default router;