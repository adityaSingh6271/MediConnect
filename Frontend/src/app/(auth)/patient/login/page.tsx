'use client';

import { usePatientAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, User, Mail, Phone, Calendar, ClipboardList, Stethoscope } from 'lucide-react';
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    age: z.coerce.number().min(1, 'Please enter a valid age'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    profilePic: z.any().optional(),
    historyOfSurgery: z.string().optional(),
    historyOfIllness: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export default function PatientLoginPage() {
    const { login, signup } = usePatientAuth();
    const [showPassword, setShowPassword] = useState(false);

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: { email: '', password: '' },
    });

    const signupForm = useForm<SignupValues>({
        resolver: zodResolver(signupSchema) as any,
        defaultValues: {
            name: '',
            age: 0,
            email: '',
            phone: '',
            password: '',
            historyOfSurgery: '',
            historyOfIllness: '',
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
                    <div className="md:col-span-2 bg-blue-600 p-8 text-white hidden md:flex flex-col justify-center space-y-6">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">Patient Portal</h2>
                            <p className="text-blue-100 mt-2">Join MediConnect to access professional healthcare anytime, anywhere.</p>
                        </div>
                        <ul className="space-y-4 text-sm text-blue-50">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-300" /> Book specialists easily</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-300" /> Instant digital prescriptions</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-300" /> Secure medical history</li>
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
                                    <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
                                    <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
                                </div>
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                        <FormField
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                                            <Input {...field} className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all" placeholder="patient@example.com" />
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
                                            {login.isPending ? 'Signing in...' : 'Sign In'}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Create Account</h3>
                                    <p className="text-gray-500 text-sm">Join our healthcare community today.</p>
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
                                                name="age"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Age</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} type="number" className="pl-10 h-11 bg-gray-50 border-gray-100" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
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
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone</FormLabel>
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
                                                name="historyOfSurgery"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Surgery History</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <ClipboardList className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} className="pl-10 h-11 bg-gray-50 border-gray-100" placeholder="Optional" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="historyOfIllness"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Illness History</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <ClipboardList className="absolute left-3 top-3 text-gray-400" size={18} />
                                                                <Input {...field} className="pl-10 h-11 bg-gray-50 border-gray-100" placeholder="e.g. Asthma, Diabetes" />
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
                                        <Button type="submit" className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-xl font-bold mt-4" disabled={signup.isPending}>
                                            {signup.isPending ? 'Creating Account...' : 'Complete Registration'}
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
