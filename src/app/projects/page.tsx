"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { projectCategories, getProjectsByCategory, getMetricsSummary } from '@/data/projects';

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  
  const filteredProjects = getProjectsByCategory(selectedCategory);
  const metrics = getMetricsSummary();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <motion.section 
      className="section-padding"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
          Robotics Engineering Portfolio
        </h1>
        <p className="text-lg text-foreground-secondary max-w-3xl mx-auto mb-8">
          Comprehensive showcase of autonomous systems, manufacturing optimization, 
          and advanced robotics solutions delivered across Fortune 500 companies and innovative startups.
        </p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-rose-600">{metrics.totalProjects}</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-rose-600">{metrics.companiesWorkedWith}</div>
            <div className="text-sm text-gray-600">Companies</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-rose-600">{metrics.technologiesUsed}</div>
            <div className="text-sm text-gray-600">Technologies</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-rose-600">$300K+</div>
            <div className="text-sm text-gray-600">Project Value</div>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {projectCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showTechnicalDetails}
              onChange={(e) => setShowTechnicalDetails(e.target.checked)}
              className="rounded"
            />
            <span>Show Technical Details</span>
          </label>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Project Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-foreground-muted">
                      <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded">
                        {project.category}
                      </span>
                      <span>{project.period}</span>
                      {project.company && <span>@ {project.company}</span>}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'Deployed' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {project.status}
                  </div>
                </div>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {project.overview}
                </p>
              </div>

              {/* Key Achievements */}
              <div className="p-6 border-b">
                <h4 className="font-semibold text-foreground mb-3">Key Achievements</h4>
                <div className="space-y-3">
                  {project.achievements.slice(0, 2).map((achievement, idx) => (
                    <div key={idx}>
                      <div className="font-medium text-sm text-foreground mb-1">
                        {achievement.title}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {achievement.metrics.slice(0, 3).map((metric, midx) => (
                          <div key={midx} className="bg-background rounded px-2 py-1 text-xs">
                            <span className="font-medium text-brand-primary">{metric.value}</span>
                            <span className="text-foreground-muted ml-1">{metric.metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Details (Expandable) */}
              {showTechnicalDetails && (
                <div className="p-6 border-b bg-background/50">
                  <h4 className="font-semibold text-foreground mb-3">Technical Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-medium text-foreground-secondary mb-1">Platforms</div>
                      <div className="flex flex-wrap gap-1">
                        {project.technicalSpecs.platforms.slice(0, 3).map((platform, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground-secondary mb-1">Key Algorithms</div>
                      <div className="flex flex-wrap gap-1">
                        {project.technicalSpecs.algorithms.slice(0, 3).map((algo, idx) => (
                          <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {algo}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground-secondary mb-1">Languages</div>
                      <div className="flex flex-wrap gap-1">
                        {project.technicalSpecs.languages.slice(0, 3).map((lang, idx) => (
                          <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground-secondary mb-1">Team</div>
                      <div className="text-foreground-muted">
                        {project.teamInfo.size} members • {project.teamInfo.role}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-foreground-muted">
                    {project.recognition && project.recognition.length > 0 && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        {project.recognition.length} Recognition{project.recognition.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {project.media.codeRepository && (
                      <a 
                        href={project.media.codeRepository} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-brand-primary transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                        </svg>
                        Code
                      </a>
                    )}
                  </div>
                  
                  <button className="text-brand-primary hover:text-brand-primary/80 transition-colors text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="text-center mt-16">
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Collaborate on Your Next Robotics Project?
          </h2>
          <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
            From concept to deployment, I deliver comprehensive robotics solutions 
            that combine cutting-edge technology with practical engineering excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
            >
              Start a Project
            </a>
            <a 
              href="/experience" 
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              View Experience
            </a>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ProjectsPage;