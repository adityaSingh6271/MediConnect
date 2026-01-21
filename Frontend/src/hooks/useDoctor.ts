import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useDoctorConsultations = () => {
    return useQuery({
        queryKey: ['doctor-consultations'],
        queryFn: async () => {
            const res = await api.get('/doctor/consultations');
            return res.data;
        },
    });
};

export const useCreatePrescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/doctor/prescription', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctor-consultations'] });
            toast.success('Prescription saved successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save prescription');
        },
    });
};

export const useDoctorProfile = () => {
    return useQuery({
        queryKey: ['doctor-profile'],
        queryFn: async () => {
            const res = await api.get('/doctor/profile');
            return res.data;
        },
    });
};
