import ProjectCard from '@/components/ProjectCard';

const projects = [
  {
    name: 'Robotic Arm Controller',
    description: 'A software controller for a 6-axis robotic arm, implemented in ROS.',
    imageUrl: '/project1.svg',
    link: '#',
  },
  {
    name: 'Autonomous Rover',
    description: 'A small autonomous rover for navigating and mapping unknown environments.',
    imageUrl: '/project2.svg',
    link: '#',
  },
];

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