import { Navbar } from "@/components/Navbar";
import { StudentForm } from "@/components/StudentForm";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentEditPage({ params }: Props) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });

  if (!student) notFound();

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
          <span className="text-gray-900 font-medium">
            {student.prenom} {student.nom}
          </span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">
                  {student.prenom[0]}
                  {student.nom[0]}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {student.prenom} {student.nom}
                </h1>
                <p className="text-gray-500 text-sm">{student.email}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <StudentForm
              mode="edit"
              initialData={{
                id: student.id,
                nom: student.nom,
                prenom: student.prenom,
                email: student.email,
                filiere: student.filiere,
                niveau: student.niveau,
                telephone: student.telephone || "",
                adresse: student.adresse || "",
                dateNaissance: student.dateNaissance || "",
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
