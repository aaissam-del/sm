import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@school.ma" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "L'administrateur existe déjà",
        email: "admin@school.ma",
      });
    }

    // Créer le mot de passe hashé
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Créer l'admin
    const admin = await prisma.user.create({
      data: {
        name: "Administrateur",
        email: "admin@school.ma",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Créer quelques étudiants de test
    const students = [
      {
        nom: "El Amrani",
        prenom: "Mohammed",
        email: "m.elamrani@student.ma",
        filiere: "Informatique",
        niveau: "1ère année",
        telephone: "0600000001",
        dateNaissance: "2002-05-15",
      },
      {
        nom: "Benali",
        prenom: "Fatima",
        email: "f.benali@student.ma",
        filiere: "Génie Logiciel",
        niveau: "2ème année",
        telephone: "0600000002",
        dateNaissance: "2001-08-22",
      },
      {
        nom: "Idrissi",
        prenom: "Youssef",
        email: "y.idrissi@student.ma",
        filiere: "Réseaux & Systèmes",
        niveau: "3ème année",
        telephone: "0600000003",
        dateNaissance: "2000-03-10",
      },
      {
        nom: "Cherkaoui",
        prenom: "Zineb",
        email: "z.cherkaoui@student.ma",
        filiere: "Intelligence Artificielle",
        niveau: "Master 1",
        telephone: "0600000004",
        dateNaissance: "1999-11-30",
      },
      {
        nom: "Oualid",
        prenom: "Hassan",
        email: "h.oualid@student.ma",
        filiere: "Cybersécurité",
        niveau: "Master 2",
        telephone: "0600000005",
        dateNaissance: "1998-07-19",
      },
    ];

    await prisma.student.createMany({ data: students });

    return NextResponse.json({
      message: "Base de données initialisée avec succès!",
      admin: { email: admin.email, password: "Admin@123" },
      studentsCreated: students.length,
    });
  } catch (error) {
    console.error("Erreur seed:", error);
    return NextResponse.json({ error: "Erreur lors de l'initialisation" }, { status: 500 });
  }
}
