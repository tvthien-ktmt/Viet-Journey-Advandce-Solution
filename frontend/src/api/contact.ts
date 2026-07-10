import { api } from './client';

export const contactApi = {
  submitContact: (data: { name: string; email: string; phone: string; subject: string; message: string; type: string }): Promise<any> => 
    api.post('/contact', data),
};
