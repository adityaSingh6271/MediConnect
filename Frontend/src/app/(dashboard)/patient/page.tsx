'use client';

import { downloadFile } from '@/lib/download';
import { useDoctors, usePatientConsultations, usePatientProfile } from '@/hooks/usePatient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConsultationForm } from '@/components/patient/ConsultationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PatientDashboard() {
    const { data: profile } = usePatientProfile();
    const { data: doctors, isLoading: doctorsLoading } = useDoctors();
    const { data: consultations, isLoading: consultationsLoading } = usePatientConsultations();
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    if (doctorsLoading || consultationsLoading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {profile?.profilePic ? (
                            <img src={`http://localhost:5001${profile.profilePic}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-gray-300">{profile?.name?.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">Hello, {profile?.name}</h1>
                        <p className="text-gray-500 font-medium">How are you feeling today?</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50" onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }}>Logout</Button>
            </header>

            <Tabs defaultValue="doctors">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-gray-100/50 p-1 rounded-xl">
                    <TabsTrigger value="doctors" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Available Doctors</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">My Consultations</TabsTrigger>
                </TabsList>

                <TabsContent value="doctors" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors?.map((doctor: any) => (
                            <Card key={doctor.id} className="flex flex-col overflow-hidden border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                                <CardHeader className="p-0">
                                    <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                                        <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-md">
                                            {doctor.profilePic ? (
                                                <img src={`http://localhost:5001${doctor.profilePic}`} alt={doctor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-300">
                                                    {doctor.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-12 px-6 pb-6 mt-1 flex-grow flex flex-col">
                                    <div className="mb-4">
                                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors uppercase tracking-tight">{doctor.name}</CardTitle>
                                        <CardDescription className="text-blue-500 font-medium uppercase text-[10px] tracking-widest">{doctor.specialty}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{doctor.yearsOfExperience}y Experience</span>
                                    </div>
                                    <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white transition-all rounded-xl h-11" onClick={() => setSelectedDoctor(doctor)}>Consult Now</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history" className="pt-6">
                    <div className="grid gap-6">
                        {consultations?.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400">No consultation history yet.</p>
                            </div>
                        )}
                        {consultations?.map((consultation: any) => (
                            <Card key={consultation.id} className="overflow-hidden border-gray-100">
                                <div className="flex flex-col md:flex-row">
                                    <div className={`w-2 md:w-3 ${consultation.prescription ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    <div className="flex-grow">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div>
                                                <CardTitle className="text-lg font-bold">Dr. {consultation.doctor.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-2">
                                                    <span>{new Date(consultation.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className={`font-semibold uppercase text-[10px] ${consultation.prescription ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {consultation.prescription ? 'Prescription Ready' : 'Awaiting Review'}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <span className="font-bold block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Illness History</span>
                                                <p className="text-gray-700">{consultation.currentIllnessHistory}</p>
                                            </div>
                                            {consultation.prescription && (
                                                <div className="mt-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Doctor's Advice</p>
                                                            <p className="text-sm text-gray-700 leading-relaxed">{consultation.prescription.careToBeTaken}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 shadow-sm transition-all rounded-lg shrink-0" asChild>
                                                                <a
                                                                    href={consultation.prescription.pdfUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    View PDF
                                                                </a>

                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="text-blue-500 px-2" onClick={() =>
                                                                downloadFile(
                                                                    consultation.prescription.pdfUrl,
                                                                    `My-Prescription-${new Date(consultation.createdAt).toLocaleDateString()}.pdf`
                                                                )
                                                            }
                                                                title="Download PDF">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {selectedDoctor && (
                <ConsultationForm
                    doctor={selectedDoctor}
                    isOpen={!!selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
}
