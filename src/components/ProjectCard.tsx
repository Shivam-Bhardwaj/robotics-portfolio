import Image from 'next/image';

interface ProjectCardProps {
  name: string;
  description: string;
  imageUrl: string;
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, description, imageUrl, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block border rounded-xl overflow-hidden shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={name}
          width={800}
          height={480}
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-700 mb-1">{description}</p>
        <span className="text-blue-600 underline">View Project →</span>
      </div>
    </a>
  );
};

export default ProjectCard;
