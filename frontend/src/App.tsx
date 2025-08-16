import React, { useState, useEffect } from 'react';
import './index.css';

const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Check backend API status
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setApiStatus(data.status))
      .catch(() => setApiStatus('Unavailable'));

    // Fetch projects
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => setProjects(data.projects));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">HiveIDE MVP</h1>
        <p>API Status: {apiStatus}</p>
      </header>

      <main className="container mx-auto p-4">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {projects.length > 0 ? (
            <ul className="space-y-2">
              {projects.map((project, index) => (
                <li key={index} className="p-2 border-b">
                  {project.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects found</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;