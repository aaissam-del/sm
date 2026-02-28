import { Navbar } from "@/components/Navbar";
import { StudentForm } from "@/components/StudentForm";
import Link from "next/link";

export default function NewStudentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-gray-700">
            Tableau de bord
          </Link>
          <span>/</span>
          <Link href="/students" className="hover:text-gray-700">
            Étudiants
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Nouveau</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              Ajouter un étudiant
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Remplissez les informations ci-dessous pour enregistrer un nouvel
              étudiant.
            </p>
          </div>
          <div className="p-6">
            <StudentForm mode="create" />
          </div>
        </div>
      </main>
    </div>
  );
}
