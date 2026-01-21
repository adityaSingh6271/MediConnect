# 🩺 MediConnect

MediConnect is a modern, full-stack healthcare platform designed to bridge the gap between patients and doctors. It provides a seamless interface for digital consultations, clinical management, and instant prescription generation.

## ✨ Key Features

### For Patients
- **Easy Registration**: Quick sign-up with medical history and profile photo.
- **Specialist Discovery**: Browse through multiple doctors across various specialties.
- **Secure Consultations**: multi-step consultation form to provide detailed health context.
- **Digital Prescriptions**: View and **Download** PDF prescriptions instantly.
- **Transaction Tracking**: Integrated payment verification via QR code.

### For Doctors
- **Professional Dashboard**: Manage all incoming patient requests in one place.
- **Clinical Overview**: Detailed view of patient illness history, surgeries, and allergies.
- **PDF Prescription Engine**: Generate high-quality, professional PDF prescriptions with a single click.
- **Profile Management**: Showcase experience, specialty, and professional credentials.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TailwindCSS, Shadcn/UI, Lucide Icons.
- **Backend**: Express.js, Node.js.
- **Database**: PostgreSQL (Prisma ORM).
- **State Management**: Tanstack Query (React Query).
- **File Handling**: Multer for uploads, PDFKit for prescription generation.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MidiConnect
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   # Create .env file with DATABASE_URL, JWT_SECRET, and PORT=5001
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   # Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5001/api
   npm run dev
   ```

## 📂 Project Structure

- `Frontend/`: Next.js application with Tailwind & Shadcn components.
- `Backend/`: Express API with Prisma architecture.
- `uploads/`: Centralized storage for profile pictures and processed PDF prescriptions.


