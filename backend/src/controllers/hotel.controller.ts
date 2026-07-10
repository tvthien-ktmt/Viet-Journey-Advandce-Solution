import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const getAllHotels = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = '0', size = '10' } = req.query;
        const take = parseInt(size as string);
        const skip = parseInt(page as string) * take;

        const [hotels, totalElements] = await prisma.$transaction([
            prisma.hotel.findMany({
                skip,
                take,
                include: { rooms: true, amenities: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.hotel.count()
        ]);
        res.json({ success: true, data: { content: hotels, totalElements } });
    } catch (error) {
        logger.error('getAllHotels error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getHotelById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const hotel = await prisma.hotel.findUnique({
            where: { id: Number(id) },
            include: { rooms: true, amenities: true }
        });

        if (!hotel) {
            res.status(404).json({ success: false, message: 'Hotel not found' });
            return;
        }

        res.json({ success: true, data: hotel });
    } catch (error) {
        logger.error('getHotelById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, location, description, price, image, rooms, amenities } = req.body;

        const newHotel = await prisma.hotel.create({
            data: {
                name, location, description, price, image,
                rooms: rooms ? { create: rooms } : undefined,
                amenities: amenities ? { create: amenities } : undefined
            },
            include: { rooms: true, amenities: true }
        });
        res.status(201).json({ success: true, message: 'Hotel created', data: newHotel });
    } catch (error) {
        logger.error('createHotel error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedHotel = await prisma.hotel.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                location: data.location,
                description: data.description,
                price: data.price,
                image: data.image,
            }
        });
        res.json({ success: true, message: 'Hotel updated', data: updatedHotel });
    } catch (error) {
        logger.error('updateHotel error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.hotel.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Hotel deleted' });
    } catch (error) {
        logger.error('deleteHotel error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
