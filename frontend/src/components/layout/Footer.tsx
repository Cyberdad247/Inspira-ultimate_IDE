import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ 
      py: 3,
      px: 2,
      mt: 'auto',
      backgroundColor: (theme) => theme.palette.primary.main,
      color: (theme) => theme.palette.primary.contrastText
    }}>
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} Inspira v6.0 - The Digital Forge
      </Typography>
    </Box>
  );
}