import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/site';

const ProjectsPage = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsPage;