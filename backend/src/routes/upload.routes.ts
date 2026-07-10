import { Router } from 'express';
import * as controller from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const router = Router();

router.post('/', authenticate, upload.single('file'), controller.uploadFile);

export default router;
