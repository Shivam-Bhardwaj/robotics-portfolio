import { siteConfig } from "@/data/site";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 p-4 mt-8 border-t">
      <div className="container mx-auto text-center">
        <p className="space-x-3">
          <span>
            &copy; {new Date().getFullYear()} • {siteConfig.name} — {siteConfig.role}
          </span>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
