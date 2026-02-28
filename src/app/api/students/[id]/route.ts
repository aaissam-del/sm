import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/students/[id] - Récupérer un étudiant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Erreur GET /api/students/[id]:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Mettre à jour un étudiant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nom, prenom, email, filiere, niveau, telephone, adresse, dateNaissance } = body;

    if (!nom || !prenom || !email || !filiere || !niveau) {
      return NextResponse.json(
        { error: "Les champs nom, prénom, email, filière et niveau sont obligatoires" },
        { status: 400 }
      );
    }

    // Vérifier si l'étudiant existe
    const existingStudent = await prisma.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    // Vérifier unicité email (sauf si c'est le même étudiant)
    const emailConflict = await prisma.student.findFirst({
      where: { email, NOT: { id } },
    });

    if (emailConflict) {
      return NextResponse.json(
        { error: "Un autre étudiant avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const student = await prisma.student.update({
      where: { id },
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

    return NextResponse.json(student);
  } catch (error) {
    console.error("Erreur PUT /api/students/[id]:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Supprimer un étudiant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const existingStudent = await prisma.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    await prisma.student.delete({ where: { id } });

    return NextResponse.json({ message: "Étudiant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE /api/students/[id]:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
