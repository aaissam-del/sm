"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/students", label: "Étudiants" },
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">GE</span>
            </div>
            <Link href="/dashboard" className="text-xl font-bold">
              Gestion Étudiants
            </Link>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/")
                    ? "bg-blue-900 text-white"
                    : "hover:bg-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User info + Logout */}
          <div className="flex items-center space-x-4">
            {session?.user && (
              <span className="text-sm hidden sm:block">
                {session.user.name || session.user.email}
              </span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-3 flex space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === link.href
                  ? "bg-blue-900 text-white"
                  : "hover:bg-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
