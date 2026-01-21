# 🩺 MediConnect

MediConnect is a full-stack online prescription and consultation platform that connects **patients** with **doctors** through a secure, digital-first healthcare workflow.

The platform supports online consultations, structured medical data collection, role-based dashboards, and server-generated **PDF prescriptions**.

---

## ✨ Features

### 👨‍⚕️ Doctor
- Secure authentication & role-based access
- Dashboard to manage patient consultations
- View detailed patient medical history
- Create, edit, and regenerate prescriptions
- Generate and send downloadable PDF prescriptions

### 🧑‍💻 Patient
- Secure sign-up with medical history
- Browse doctors by specialty
- Multi-step consultation form
- QR-based payment submission
- Access and download prescriptions

---

## 🧱 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **TanStack Query**
- **Axios (single instance)**

### Backend
- **Node.js**
- **Express.js**
- **TypeScript (ESM)**
- **JWT Authentication**
- **Prisma ORM**

### Database & Files
- **PostgreSQL**
- **Multer** – image uploads
- **PDFKit** – prescription PDFs

---

## 📂 Repository Structure

```text
MediConnect/
├── Frontend/        # Next.js application
├── Backend/         # Express + Prisma API
├── uploads/         # Images & prescription PDFs
├── README.md        # Repository overview


🛠️ Getting Started
Prerequisites

Node.js v18+

PostgreSQL database

🔧 Backend Setup
cd Backend
npm install


Create a .env file inside Backend/:

PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key


Run Prisma & start the backend server:

npx prisma generate
npx prisma db push
npm run dev


Backend runs on:

http://localhost:5000

🎨 Frontend Setup
cd Frontend
npm install


Create a .env.local file inside Frontend/:

NEXT_PUBLIC_API_URL=http://localhost:5000/api


Start the frontend:

npm run dev


Frontend runs on:

http://localhost:3000

🔐 Authentication & Security

JWT-based authentication

Role-based authorization (Doctor / Patient)

Doctors can access only their consultations

Patients cannot edit prescriptions

Secure file access for PDFs & images

📄 Prescription Workflow

Patient submits consultation form

Doctor reviews medical data

Doctor creates or edits prescription

Server generates PDF

Patient downloads prescription

🚀 Future Enhancements

Appointment scheduling

Admin dashboard

Email notifications

Payment gateway integration

Audit logs for prescriptions

🧑‍💻 Author

Aditya Singh
Full-stack Developer | MERN | Next.js | Prisma | GenAI
