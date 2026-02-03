import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getUsers, deleteUser, getSystemStats, getAllDocuments, deleteDocument } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect); // All admin routes require login
router.use(admin);   // All admin routes require admin role

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getSystemStats);
router.get('/documents', getAllDocuments);
router.delete('/documents/:id', deleteDocument);

export default router;
