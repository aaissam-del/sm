# Application de Gestion des Etudiants

Application web full-stack de gestion des étudiants développée avec Next.js 16, Prisma, SQLite et NextAuth.

## Fonctionnalités

- **Authentification** : Connexion sécurisée avec email/mot de passe (NextAuth)
- **Dashboard** : Statistiques globales (total étudiants, filières, niveaux)
- **CRUD Étudiants** : Ajouter, modifier, supprimer, lister les étudiants
- **Recherche & Filtres** : Rechercher par nom/email et filtrer par filière/niveau
- **Interface Responsive** : Design moderne avec Tailwind CSS

## Technologies

- **Frontend/Backend** : Next.js 16 (App Router) + TypeScript
- **Base de données** : SQLite via Prisma ORM
- **Authentification** : NextAuth v5 beta (JWT strategy)
- **Styles** : Tailwind CSS

## Installation locale

### Prérequis
- Node.js v18+
- npm ou yarn

### Étapes

1. Cloner le dépôt :
```bash
git clone https://github.com/aaissam-del/sm.git
cd sm
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Modifier .env avec vos valeurs
```

4. Initialiser la base de données :
```bash
npx prisma migrate dev --name init
```

5. Lancer le serveur :
```bash
npm run dev
```

6. Seeder la base de données (première utilisation) :
```
Accéder à http://localhost:3000/api/seed
```

## Identifiants de test

| Email | Mot de passe |
|-------|-------------|
| admin@school.ma | Admin@123 |

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="votre-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="votre-secret-min-32-chars"
```

## Déploiement sur Vercel

> ⚠️ **Note** : SQLite n'est pas supporté sur Vercel (système de fichiers éphémère).
> Pour la production, migrez vers PostgreSQL (Neon, Supabase, etc.).

### Variables d'environnement Vercel requises :
- `DATABASE_URL` : URL de votre base PostgreSQL
- `AUTH_SECRET` : Secret JWT (min 32 caractères)
- `NEXTAUTH_URL` : URL de production (ex: https://votre-app.vercel.app)

## Structure du projet

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handlers
│   │   ├── students/            # CRUD API étudiants
│   │   └── seed/                # Route de seeding
│   ├── dashboard/               # Tableau de bord
│   ├── login/                   # Page de connexion
│   └── students/                # Pages CRUD étudiants
├── components/
│   ├── AuthProvider.tsx
│   ├── Navbar.tsx
│   └── StudentForm.tsx
└── lib/
    ├── auth.ts                  # Config NextAuth
    └── db.ts                    # Client Prisma
```


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
