import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000');
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        setBackendStatus(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBackendStatus();
  }, []);

  return (
    <div>
      <h1>Inspira v6.0</h1>
      <p>Development environment running</p>
      {backendStatus && (
        <div>
          <h2>Backend Status</h2>
          <pre>{JSON.stringify(backendStatus, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);