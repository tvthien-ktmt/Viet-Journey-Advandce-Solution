import { Request, Response } from 'express';

export const getBaggagePricing = async (req: Request, res: Response): Promise<void> => {
    // Return static pricing for Baggage
    res.json({
        success: true,
        data: [
            { id: 1, weight: '10kg', price: 150000 },
            { id: 2, weight: '20kg', price: 250000 },
            { id: 3, weight: '30kg', price: 400000 },
            { id: 4, weight: '40kg', price: 550000 }
        ]
    });
};

export const getMealOptions = async (req: Request, res: Response): Promise<void> => {
    // Return static meal options
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Suất ăn chay', price: 100000 },
            { id: 2, name: 'Suất ăn trẻ em', price: 80000 },
            { id: 3, name: 'Cơm gà xào sả ớt', price: 120000 },
            { id: 4, name: 'Mì xào hải sản', price: 150000 }
        ]
    });
};

export const getInsuranceOptions = async (req: Request, res: Response): Promise<void> => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Bảo hiểm trễ chuyến (VBI)', price: 50000, coverage: 'Lên đến 1.000.000đ' },
            { id: 2, name: 'Bảo hiểm du lịch toàn diện (MIC)', price: 120000, coverage: 'Lên đến 100.000.000đ' }
        ]
    });
};
