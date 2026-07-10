import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { featured, limit } = req.query;
        const take = limit ? parseInt(limit as string) : undefined;
        const isFeatured = featured === 'true' ? true : undefined;

        const tours = await prisma.tour.findMany({
            where: {
                ...(isFeatured !== undefined && { isFeatured }),
            },
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                itineraries: true,
                highlights: true,
                inclusions: true,
                exclusions: true,
            }
        });
        res.json({ success: true, data: tours });
    } catch (error) {
        console.error('getAllTours error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getTourByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idOrSlug } = req.params;
        const isId = !isNaN(Number(idOrSlug));

        const tour = await prisma.tour.findFirst({
            where: isId ? { id: Number(idOrSlug) } : { slug: idOrSlug as string },
            include: {
                itineraries: { orderBy: { dayNumber: 'asc' } },
                highlights: true,
                inclusions: true,
                exclusions: true,
            }
        });

        if (!tour) {
            res.status(404).json({ success: false, message: 'Tour not found' });
            return;
        }

        res.json({ success: true, data: tour });
    } catch (error) {
        console.error('getTourByIdOrSlug error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug, image, location, price, oldPrice, duration, overview, isFeatured, itineraries, highlights, inclusions, exclusions } = req.body;

        const newTour = await prisma.tour.create({
            data: {
                name, slug, image, location, price, oldPrice, duration, overview, isFeatured,
                itineraries: itineraries ? { create: itineraries } : undefined,
                highlights: highlights ? { create: highlights } : undefined,
                inclusions: inclusions ? { create: inclusions } : undefined,
                exclusions: exclusions ? { create: exclusions } : undefined,
            },
            include: { itineraries: true, highlights: true, inclusions: true, exclusions: true }
        });
        res.status(201).json({ success: true, message: 'Tour created', data: newTour });
    } catch (error) {
        console.error('createTour error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;

        // In a real app we need to carefully update nested relations (delete and recreate or upsert)
        // For simplicity, we just update scalar fields here if nested data is not provided properly
        const updatedTour = await prisma.tour.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                slug: data.slug,
                image: data.image,
                location: data.location,
                price: data.price,
                oldPrice: data.oldPrice,
                duration: data.duration,
                overview: data.overview,
                isFeatured: data.isFeatured,
            }
        });
        res.json({ success: true, message: 'Tour updated', data: updatedTour });
    } catch (error) {
        console.error('updateTour error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.tour.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Tour deleted' });
    } catch (error) {
        console.error('deleteTour error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
