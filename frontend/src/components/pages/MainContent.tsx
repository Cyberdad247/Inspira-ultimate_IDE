import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { get } from '../../services/api';

interface ExampleData {
  id: number;
  title: string;
  description: string;
}

export default function MainContent() {
  const [data, setData] = useState<ExampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get<ExampleData[]>('/examples');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Integration Example
      </Typography>
      
      {loading && <CircularProgress />}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {data.length > 0 && (
        <Box>
          {data.map((item) => (
            <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography>{item.description}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}