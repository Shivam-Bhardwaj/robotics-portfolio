import Image from "next/image";

interface ExperienceCardProps {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  imageUrl: string;
}

const ExperienceCard = ({ company, role, period, location, description, imageUrl }: ExperienceCardProps) => {
  return (
    <div className="flex gap-4 p-4 border rounded-md bg-white shadow-sm">
      <Image src={imageUrl} alt={company} width={64} height={64} className="rounded-md object-contain" />
      <div>
        <h3 className="text-xl font-semibold">{role}</h3>
        <p className="text-gray-600">{company} • {period}</p>
        <p className="text-gray-600 italic">{location}</p>
        <p className="mt-2 text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default ExperienceCard;
