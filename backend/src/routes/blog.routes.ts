import { Router } from 'express';
import * as controller from '../controllers/blog.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', controller.getAllBlogs);
router.get('/slug/:slug', controller.getBlogBySlug);
router.get('/:id', controller.getBlogById);

// Admin only
router.post('/', authenticate, authorizeAdmin, controller.createBlog);
router.put('/:id', authenticate, authorizeAdmin, controller.updateBlog);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteBlog);

export default router;
