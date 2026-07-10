import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: blogs });
    } catch (error) {
        logger.error('getAllBlogs error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });

        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }

        res.json({ success: true, data: blog });
    } catch (error) {
        logger.error('getBlogById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const blog = await prisma.blog.findUnique({ where: { slug: slug as string } });
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.json({ success: true, data: blog });
    } catch (error) {
        logger.error('getBlogBySlug error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, image, author } = req.body;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newBlog = await prisma.blog.create({
            data: { title, slug, content, image, author }
        });
        res.status(201).json({ success: true, message: 'Blog created', data: newBlog });
    } catch (error) {
        logger.error('createBlog error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content, image, author } = req.body;
        
        let slug;
        if (title) {
            slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: Number(id) },
            data: {
                ...(title && { title }),
                ...(slug && { slug }),
                ...(content && { content }),
                ...(image && { image }),
                ...(author && { author })
            }
        });
        res.json({ success: true, message: 'Blog updated', data: updatedBlog });
    } catch (error) {
        logger.error('updateBlog error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.blog.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
        logger.error('deleteBlog error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
