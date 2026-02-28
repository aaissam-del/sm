import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/students - Lister tous les étudiants
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filiere = searchParams.get("filiere") || "";
    const niveau = searchParams.get("niveau") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { prenom: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (filiere) where.filiere = filiere;
    if (niveau) where.niveau = niveau;

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Erreur GET /api/students:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/students - Créer un étudiant
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { nom, prenom, email, filiere, niveau, telephone, adresse, dateNaissance } = body;

    if (!nom || !prenom || !email || !filiere || !niveau) {
      return NextResponse.json(
        { error: "Les champs nom, prénom, email, filière et niveau sont obligatoires" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Un étudiant avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({
      data: {
        nom,
        prenom,
        email,
        filiere,
        niveau,
        telephone: telephone || null,
        adresse: adresse || null,
        dateNaissance: dateNaissance || null,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/students:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
