import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useDoctors = () => {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const res = await api.get('/patient/doctors');
            return res.data;
        },
    });
};

export const useCreateConsultation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/patient/consultation', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patient-consultations'] });
            toast.success('Consultation submitted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit consultation');
        },
    });
};

export const usePatientConsultations = () => {
    return useQuery({
        queryKey: ['patient-consultations'],
        queryFn: async () => {
            const res = await api.get('/patient/consultations');
            return res.data;
        },
    });
};

export const usePatientProfile = () => {
    return useQuery({
        queryKey: ['patient-profile'],
        queryFn: async () => {
            const res = await api.get('/patient/profile');
            return res.data;
        },
    });
};
