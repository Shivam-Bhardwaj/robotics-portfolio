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
            "The gap between prototype and product? I live there.",
            "From self-driving to med-tech, I ship reliable systems.",
            "I optimize, reduce costs, and deliver hardware at scale.",
          ]}
        />
      </p>
      <p className="max-w-3xl text-gray-700">
        As both a hands-on engineer and project manager, I turn complex concepts in self-driving and med-tech into reliable, deployed systems. I optimize, reduce costs, and ship products for companies like Meta, Applied Materials, Google, GoPro, Saildrone, Velodyne Lidar, Hummingbird EV, Tesla, and more than twenty startups and researchers. As an NSF-trained pedagogy professional, I also teach how to teach.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/projects"
          className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-500"
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
