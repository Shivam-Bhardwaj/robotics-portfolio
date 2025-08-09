import ExperienceCard from "@/components/ExperienceCard";
import { experiences } from "@/data/experience";

const ExperiencePage = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">Experience</h1>
      <div className="flex flex-col gap-6">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.company + exp.role} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default ExperiencePage;
