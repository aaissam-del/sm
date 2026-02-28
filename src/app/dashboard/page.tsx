import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";

async function getStats() {
  const [totalStudents, filieres] = await Promise.all([
    prisma.student.count(),
    prisma.student.groupBy({
      by: ["filiere"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  const niveaux = await prisma.student.groupBy({
    by: ["niveau"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const recentStudents = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return { totalStudents, filieres, niveaux, recentStudents };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { totalStudents, filieres, niveaux, recentStudents } = await getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, {session.user?.name || session.user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Étudiants</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Filières</p>
                <p className="text-3xl font-bold text-gray-900">{filieres.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Niveaux</p>
                <p className="text-3xl font-bold text-gray-900">{niveaux.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent students table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Derniers étudiants
              </h2>
              <Link
                href="/students"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir tous →
              </Link>
            </div>
            {recentStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun étudiant enregistré</p>
                <Link
                  href="/students/new"
                  className="text-blue-600 hover:underline mt-2 block"
                >
                  Ajouter un étudiant
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-medium text-sm">
                          {student.prenom[0]}
                          {student.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {student.prenom} {student.nom}
                        </p>
                        <p className="text-xs text-gray-500">{student.filiere}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {student.niveau}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filieres stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par filière
            </h2>
            {filieres.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Aucune donnée disponible
              </p>
            ) : (
              <div className="space-y-3">
                {filieres.map((f) => (
                  <div key={f.filiere}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{f.filiere}</span>
                      <span className="text-gray-500">
                        {f._count.id} étudiant(s)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.round((f._count.id / totalStudents) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/students/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Nouvel étudiant</span>
          </Link>
          <Link
            href="/students"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voir la liste
          </Link>
        </div>
      </main>
    </div>
  );
}
