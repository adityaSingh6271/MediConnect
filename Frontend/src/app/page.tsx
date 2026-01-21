import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-gray-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Activity size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">MediConnect</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/patient/login" className="hover:text-blue-600 transition-colors">Login</Link>
          <Button asChild className="rounded-full px-6 bg-blue-600 hover:bg-blue-700">
            <Link href="/patient/login">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Redefining Telemedicine
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
            Your Health, <br />
            <span className="text-blue-600">Digitally Connected.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional medical consultations and instant digital prescriptions.
            The bridge between doctors and patients, simplified.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-2xl bg-gray-900 hover:bg-gray-800 transition-all hover:scale-105">
              <Link href="/patient/login" className="flex items-center gap-2">
                Join as Patient <ArrowRight size={20} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-2xl border-gray-200 hover:bg-gray-50 transition-all hover:scale-105">
              <Link href="/doctor/login">Doctor Portal</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-white py-24 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold">Secure Data</h3>
                <p className="text-gray-500 leading-relaxed">Your medical history and prescriptions are stored with enterprise-grade security.</p>
              </div>
              <div className="space-y-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold">Instant Access</h3>
                <p className="text-gray-500 leading-relaxed">Consult with specialized doctors and get prescriptions in minutes, not hours.</p>
              </div>
              <div className="space-y-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold">Seamless Experience</h3>
                <p className="text-gray-500 leading-relaxed">A simple, intuitive interface designed for both doctors and patients.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            <span className="font-bold">MediConnect</span>
          </div>
          <div className="text-sm text-gray-400">
            &copy; 2026 MediConnect. Built for better healthcare.
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
