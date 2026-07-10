import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: blogs });
    } catch (error) {
        console.error('getAllBlogs error:', error);
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
        console.error('getBlogById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, image, author } = req.body;
        const newBlog = await prisma.blog.create({
            data: { title, content, image, author }
        });
        res.status(201).json({ success: true, message: 'Blog created', data: newBlog });
    } catch (error) {
        console.error('createBlog error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedBlog = await prisma.blog.update({
            where: { id: Number(id) },
            data
        });
        res.json({ success: true, message: 'Blog updated', data: updatedBlog });
    } catch (error) {
        console.error('updateBlog error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.blog.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
        console.error('deleteBlog error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
