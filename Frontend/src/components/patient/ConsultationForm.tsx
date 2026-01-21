'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCreateConsultation } from '@/hooks/usePatient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const consultationSchema = z.object({
    currentIllnessHistory: z.string().min(5, 'Please provide more detail about your current illness'),
    recentSurgery: z.string().optional(),
    isDiabetic: z.string(), // Keep as string for form
    allergies: z.string().optional(),
    others: z.string().optional(),
    transactionId: z.string().min(5, 'Please enter a valid Transaction ID'),
});

type FormValues = z.infer<typeof consultationSchema>;

export function ConsultationForm({ doctor, isOpen, onClose }: { doctor: any, isOpen: boolean, onClose: () => void }) {
    const [step, setStep] = useState(1);
    const createConsultation = useCreateConsultation();

    const form = useForm<FormValues>({
        resolver: zodResolver(consultationSchema) as any,
        defaultValues: {
            currentIllnessHistory: '',
            recentSurgery: '',
            isDiabetic: 'false',
            allergies: '',
            others: '',
            transactionId: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        const data = {
            ...values,
            doctorId: doctor.id,
            isDiabetic: values.isDiabetic === 'true'
        };
        createConsultation.mutate(data, {
            onSuccess: () => {
                onClose();
                setStep(1);
                form.reset();
            }
        });
    };

    const nextStep = async () => {
        const fieldMap: Record<number, (keyof FormValues)[]> = {
            1: ['currentIllnessHistory', 'recentSurgery'],
            2: ['isDiabetic', 'allergies', 'others'],
        };
        const fieldsToValidate = fieldMap[step];
        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-blue-600 p-6 text-white">
                    <DialogTitle className="text-2xl font-bold">Consult Dr. {doctor.name}</DialogTitle>
                    <p className="text-blue-100 text-sm mt-1">Please provide your health details for a better diagnosis.</p>
                </div>

                <div className="p-6">
                    <div className="flex justify-between mb-8 relative">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {s}
                                </div>
                                <span className="text-[10px] uppercase font-bold mt-2 text-gray-400">Step {s}</span>
                            </div>
                        ))}
                        <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -z-0">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(step - 1) * 50}%` }}></div>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <FormField
                                        name="currentIllnessHistory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Current Illness History</FormLabel>
                                                <FormControl><Textarea className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500" placeholder="Describe symptoms, duration, and severity..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="recentSurgery"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Recent Surgery with time span</FormLabel>
                                                <FormControl><Input className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} placeholder="e.g. Appendectomy 6 months ago" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="pt-4">
                                        <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl" onClick={nextStep}>
                                            Continue to Health Info
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <FormField
                                        name="isDiabetic"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-gray-700 font-semibold">Are you diabetic?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                                                        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex-1">
                                                            <RadioGroupItem value="true" id="d1" />
                                                            <Label htmlFor="d1" className="flex-1 cursor-pointer">Yes</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex-1">
                                                            <RadioGroupItem value="false" id="d2" />
                                                            <Label htmlFor="d2" className="flex-1 cursor-pointer">No</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="allergies"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Allergies (if any)</FormLabel>
                                                <FormControl><Input className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} placeholder="e.g. Penicillin, Peanuts" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="others"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Other Medical Conditions</FormLabel>
                                                <FormControl><Input className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <Button type="button" variant="outline" className="h-12 rounded-xl border-gray-200" onClick={prevStep}>Back</Button>
                                        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl" onClick={nextStep}>Continue</Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-gray-50 p-6 flex flex-col items-center rounded-2xl border border-dashed border-gray-300">
                                        <div className="w-32 h-32 bg-white border rounded-xl flex items-center justify-center shadow-sm mb-3 overflow-hidden">
                                            <img src="/payment_qr.png" alt="Payment QR Code" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-700">Scan to Pay Consultation Fee</p>
                                            <p className="text-xs text-gray-500">Fast & Secure Payment</p>
                                        </div>
                                    </div>
                                    <FormField
                                        name="transactionId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Transaction ID</FormLabel>
                                                <FormControl><Input className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12" {...field} placeholder="Enter the 12-digit transaction ID" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <Button type="button" variant="outline" className="h-12 rounded-xl border-gray-200" onClick={prevStep}>Back</Button>
                                        <Button type="submit" className="bg-gray-900 hover:bg-black text-white h-12 rounded-xl" disabled={createConsultation.isPending}>
                                            {createConsultation.isPending ? 'Submitting...' : 'Complete Consultation'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
