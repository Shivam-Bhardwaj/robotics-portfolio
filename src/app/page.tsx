import Link from "next/link";
import { siteConfig } from "@/data/site";
import Typewriter from "@/components/Typewriter";

export default function Home() {
  return (
    <section className="relative overflow-hidden flex flex-col items-center text-center gap-8 py-14 md:py-20">
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-600">
          {siteConfig.name}
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          {siteConfig.role} • {siteConfig.location}
        </p>
      </div>
      <p className="max-w-2xl text-gray-700">
        <Typewriter
          phrases={[
            "I build robots that don’t bump into chairs.",
            "Sometimes they do. We fix it with math.",
            "Mapping, perception, control—preferably in real-time.",
          ]}
        />
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/projects"
          className="rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-700"
        >
          View Projects
        </Link>
        <Link
          href="/skills"
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          My Skills
        </Link>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
