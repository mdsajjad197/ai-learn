import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getUsers, deleteUser, getSystemStats, getAllDocuments, deleteDocument, deleteAllDocuments, getDocument } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect); // All admin routes require login
router.use(admin);   // All admin routes require admin role

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getSystemStats);
router.delete('/documents', deleteAllDocuments); // Specific route before parameterized
router.get('/documents', getAllDocuments);
router.get('/documents/:id', getDocument); // Parameterized route
router.delete('/documents/:id', deleteDocument);

export default router;
