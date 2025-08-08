import { siteConfig } from "@/data/site";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="space-x-3">
          <span>
            &copy; {new Date().getFullYear()} • {siteConfig.name} — {siteConfig.role}
          </span>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
