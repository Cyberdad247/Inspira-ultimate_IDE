import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export default function Header() {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inspira v6.0
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
}