'use client';

import { downloadFile } from '@/lib/download';
import { useDoctorConsultations, useDoctorProfile } from '@/hooks/useDoctor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrescriptionModal } from '@/components/doctor/PrescriptionModal';
import { useState } from 'react';

export default function DoctorDashboard() {
    const { data: profile, isLoading: profileLoading } = useDoctorProfile();
    const { data: consultations, isLoading: consultationsLoading } = useDoctorConsultations();
    const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

    if (profileLoading || consultationsLoading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {profile?.profilePic ? (
                            <img src={`http://localhost:5001${profile.profilePic}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-blue-400">{profile?.name?.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">Welcome, Dr. {profile?.name}</h1>
                        <p className="text-gray-500 font-medium">{profile?.specialty} | {profile?.yearsOfExperience}y Experience</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50" onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }}>Logout</Button>
            </header>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-600 rounded-full" />
                        Recent Consultations
                    </h2>
                    <div className="text-sm text-gray-500 font-medium">
                        Total: {consultations?.length || 0}
                    </div>
                </div>

                <div className="grid gap-6">
                    {consultations?.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No consultations to show yet.</p>
                        </div>
                    )}
                    {consultations?.map((consultation: any) => (
                        <Card key={consultation.id} className="overflow-hidden border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                                {/* Side Status Bar */}
                                <div className={`w-full md:w-2 ${consultation.prescription ? 'bg-green-500' : 'bg-blue-600'}`} />

                                <div className="flex-grow p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border">
                                                {consultation.patient.profilePic ? (
                                                    <img src={`http://localhost:5001${consultation.patient.profilePic}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-400">{consultation.patient.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{consultation.patient.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{consultation.patient.age} Years</span>
                                                    <span>•</span>
                                                    <span>{consultation.patient.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${consultation.prescription ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {consultation.prescription ? 'Prescription Issued' : 'Action Required'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Current Complaint</span>
                                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{consultation.currentIllnessHistory}</p>
                                            </div>
                                            {consultation.patient.historyOfIllness && (
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Medical History</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {consultation.patient.historyOfIllness.split(',').map((ill: string, i: number) => (
                                                            <span key={i} className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-gray-600 border shadow-sm">{ill.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Surgery History</span>
                                                <p className="text-sm text-gray-700 font-medium">{consultation.patient.historyOfSurgery || 'No previous surgeries reported'}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Allergies</span>
                                                <p className={`text-sm font-medium ${consultation.allergies ? 'text-red-500' : 'text-gray-700'}`}>{consultation.allergies || 'No known allergies'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-6">
                                        <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-8" onClick={() => setSelectedConsultation(consultation)}>
                                            {consultation.prescription ? 'Update Prescription' : 'Issue Prescription'}
                                        </Button>
                                        {consultation.prescription?.pdfUrl && (
                                            <div className="flex gap-2">
                                                <Button size="lg" variant="outline" className="border-gray-200 rounded-xl px-8" asChild>
                                                    <a
                                                        href={consultation.prescription.pdfUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View PDF
                                                    </a>

                                                </Button>
                                                <Button size="lg" variant="ghost" className="rounded-xl px-4 text-blue-600" onClick={() =>
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
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {selectedConsultation && (
                <PrescriptionModal
                    consultation={selectedConsultation}
                    isOpen={!!selectedConsultation}
                    onClose={() => setSelectedConsultation(null)}
                />
            )}
        </div>
    );
}
