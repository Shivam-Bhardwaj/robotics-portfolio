"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

const Navbar = () => {
  const pathname = usePathname();

  const navItemClass = (href: string) =>
    `${pathname === href ? "text-blue-600 underline" : "text-gray-600"} hover:text-gray-800`;

  return (
    <nav className="bg-white text-gray-800 shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          {siteConfig.name}
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className={navItemClass("/")}>Home</Link>
          </li>
          <li>
            <Link href="/projects" className={navItemClass("/projects")}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="/skills" className={navItemClass("/skills")}>Skills</Link>
          </li>
          <li>
            <Link href="/contact" className={navItemClass("/contact")}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
