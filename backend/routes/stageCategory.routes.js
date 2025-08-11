import express from 'express';
import { isLoggedIn, authorisedRoles } from '../middleware/auth.middleware.js';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/stageCategory.controller.js';

const router = express.Router();

// public
router.get('/', listCategories);
router.get('/:id', getCategory);

// admin
router.use(isLoggedIn);
router.use(authorisedRoles('ADMIN'));
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;


