import { Router } from 'express';
import { OrganisationController } from './organisation.controller';
import { authenticate } from '@src/auth/auth.middleware';

const router = Router();
const organisationController = new OrganisationController();

// Protected routes - these will have req.user populated
router.post('/', authenticate, organisationController.handleCreate);
router.put('/:_id', authenticate, organisationController.handleUpdate);
router.delete('/:_id', authenticate, organisationController.handleDelete);

// Public routes - these don't require authentication
router.post('/list', organisationController.handleGetAll);
router.post('/details', organisationController.handleGetById);

export const OrganisationRouter = router;