import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useDoctorAuth = () => {
    const router = useRouter();

    const signup = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/auth/doctor/signup', data);
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Registration successful');
            router.push('/doctor');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    const login = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/auth/doctor/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Login successful');
            router.push('/doctor');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    return { signup, login };
};

export const usePatientAuth = () => {
    const router = useRouter();

    const signup = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/auth/patient/signup', data);
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Registration successful');
            router.push('/patient');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    const login = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/auth/patient/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Login successful');
            router.push('/patient');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    return { signup, login };
};
