'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePrescription } from '@/hooks/useDoctor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const prescriptionSchema = z.object({
    careToBeTaken: z.string().min(5, 'Please provide clear care instructions for the patient'),
    medicines: z.string().min(5, 'Please list the prescribed medicines and dosages'),
});

interface PrescriptionModalProps {
    consultation: any;
    isOpen: boolean;
    onClose: () => void;
}

export function PrescriptionModal({ consultation, isOpen, onClose }: PrescriptionModalProps) {
    const createPrescription = useCreatePrescription();
    const form = useForm<z.infer<typeof prescriptionSchema>>({
        resolver: zodResolver(prescriptionSchema) as any,
        defaultValues: {
            careToBeTaken: consultation.prescription?.careToBeTaken || '',
            medicines: consultation.prescription?.medicines || '',
        },
    });

    const onSubmit = (data: z.infer<typeof prescriptionSchema>) => {
        createPrescription.mutate(
            { consultationId: consultation.id, ...data },
            { onSuccess: () => onClose() }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gray-900 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        Write Prescription
                    </DialogTitle>
                    <div className="mt-4 flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm border border-gray-700">
                            <span className="text-gray-400">Patient:</span>
                            <span className="font-bold">{consultation.patient.name}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm border border-gray-700">
                            <span className="text-gray-400">Age:</span>
                            <span className="font-bold">{consultation.patient.age}y</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="careToBeTaken"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-gray-700 font-bold uppercase text-[10px] tracking-widest">Medical Advice & Care</FormLabel>
                                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Mandatory</span>
                                        </div>
                                        <FormControl>
                                            <Textarea className="min-h-[120px] resize-none border-gray-100 focus:border-blue-500 bg-gray-50/50 rounded-xl p-4 transition-all" placeholder="Enter detailed care instructions, dietary advice, or lifestyle changes..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="medicines"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-bold uppercase text-[10px] tracking-widest">Prescribed Medications</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-[120px] resize-none border-gray-100 focus:border-blue-500 bg-gray-50/50 rounded-xl p-4 transition-all" placeholder="Medicine Name - Dosage - Frequency - Duration" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl border-gray-200" onClick={onClose}>Discard Changes</Button>
                                <Button type="submit" className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]" disabled={createPrescription.isPending}>
                                    {createPrescription.isPending ? (
                                        <div className="flex items-center gap-2">
                                            <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                            Generating PDF...
                                        </div>
                                    ) : (
                                        'Submit & Generate PDF'
                                    )}
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">Generating PDF will automatically notify the patient</p>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
