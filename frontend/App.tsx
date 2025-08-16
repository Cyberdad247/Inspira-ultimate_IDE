import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Project[] = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Inspira Project Manager</h1>
        {loading ? (
          <p className="text-gray-600">Loading projects...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;