'use client';

import { useDoctorAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, User, Mail, Phone, Briefcase, Award, Stethoscope } from 'lucide-react';
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    specialty: z.string().min(2, 'Specialty must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
    yearsOfExperience: z.coerce.number().min(0, 'Please enter a valid number'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    profilePic: z.any().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export default function DoctorLoginPage() {
    const { login, signup } = useDoctorAuth();
    const [showPassword, setShowPassword] = useState(false);

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: { email: '', password: '' },
    });

    const signupForm = useForm<SignupValues>({
        resolver: zodResolver(signupSchema) as any,
        defaultValues: {
            name: '',
            specialty: '',
            email: '',
            phone: '',
            yearsOfExperience: 0,
            password: '',
        },
    });

    const onLogin = (data: LoginValues) => login.mutate(data);
    const onSignup = (data: SignupValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'profilePic' && value?.[0]) {
                formData.append(key, value[0]);
            } else if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });
        signup.mutate(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
            <Card className="w-full max-w-2xl border-none shadow-2xl shadow-blue-100/50 overflow-hidden">
                <div className="grid md:grid-cols-5 min-h-[600px]">
                    <div className="md:col-span-2 bg-[#1E293B] p-8 text-white hidden md:flex flex-col justify-center space-y-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">Doctor Portal</h2>
                            <p className="text-slate-400 mt-2">Manage your clinical practice digitally with MediConnect's advanced tools.</p>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Manage appointments</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Digital prescriptions (PDF)</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Reach more patients</li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 p-6 md:p-8 bg-white">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-xl p-1">
                                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Physician Login</h3>
                                    <p className="text-gray-500 text-sm">Welcome back, doctor. Please sign in.</p>
                                </div>
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                        <FormField
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Professional Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                                            <Input {...field} className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all" placeholder="doctor@example.com" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input {...field} type={showPassword ? "text" : "password"} className="pr-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                            >
                                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100" disabled={login.isPending}>
                                            {login.isPending ? 'Logging in...' : 'Access Dashboard'}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Register as Doctor</h3>
                                    <p className="text-gray-500 text-sm">Become part of our specialist network.</p>
                                </div>
                                <Form {...signupForm}>
                                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                            <FormField
                                                name="profilePic"
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormLabel>Profile Picture</FormLabel>
                                                        <FormControl>
                                                            <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} className="bg-gray-50 border-gray-100 cursor-pointer" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} className="pl-10 h-11 bg-gray-50 border-gray-100" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="specialty"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Specialization</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} className="pl-10 h-11 bg-gray-50 border-gray-100" placeholder="e.g. Cardiologist" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="yearsOfExperience"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Years of Exp.</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Award className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} type="number" step="0.1" className="pl-10 h-11 bg-gray-50 border-gray-100" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Contact Number</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} className="pl-10 h-11 bg-gray-50 border-gray-100" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormLabel>Email address</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} type="email" className="pl-10 h-11 bg-gray-50 border-gray-100" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormLabel>Create Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input {...field} type={showPassword ? "text" : "password"} className="pr-10 h-11 bg-gray-50 border-gray-100" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                </button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold mt-4 shadow-lg shadow-blue-100" disabled={signup.isPending}>
                                            {signup.isPending ? 'Registering...' : 'Create Professional Account'}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </Card>
        </div>
    );
}
