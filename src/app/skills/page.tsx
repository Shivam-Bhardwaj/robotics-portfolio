import SkillBadge from '@/components/SkillBadge';

const skills = [
  'ROS',
  'Python',
  'C++',
  'OpenCV',
  'PyTorch',
  'TensorFlow',
  'Docker',
  'Git',
];

const SkillsPage = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">My Skills</h1>
      <div className="flex flex-wrap gap-4">
        {skills.map((skill) => (
          <SkillBadge key={skill} name={skill} />
        ))}
      </div>
    </section>
  );
};

export default SkillsPage;