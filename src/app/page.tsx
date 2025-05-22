'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleClose();
  };

  const getUserInitial = () => {
    if (!user?.email) return '';
    return user.email.charAt(0).toUpperCase();
  };

  const features = [
    {
      title: 'Voice-to-Text',
      description: 'Convert your standup meetings to text in real-time',
      icon: <MicIcon sx={{ color: 'primary.main' }} />,
    },
    {
      title: 'AI-Powered Summaries',
      description: 'Get concise summaries of your team updates',
      icon: <AutoAwesomeIcon sx={{ color: 'primary.main' }} />,
    },
    {
      title: 'Fast & Efficient',
      description: 'Save time with automated meeting summaries',
      icon: <SpeedIcon sx={{ color: 'primary.main' }} />,
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          py: 2,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => router.push('/')}
        >
          Sync
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Link href="/contact-us" passHref>
            <Button variant="text" sx={{ color: '#fff' }}>Contact Us</Button>
          </Link>
          <Link href="/terms-and-conditions" passHref>
            <Button variant="text" sx={{ color: '#fff' }}>Terms & Conditions</Button>
          </Link>
          <Link href="/privacy-policy" passHref>
            <Button variant="text" sx={{ color: '#fff' }}>Privacy Policy</Button>
          </Link>
          <Link href="/cancellations-and-refunds" passHref>
            <Button variant="text" sx={{ color: '#fff' }}>Cancellations & Refunds</Button>
          </Link>
          {user && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {getUserInitial()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  mb: 2
                }}
              >
                {user ? `Welcome Back, ${user.user_metadata.full_name || user.email?.split('@')[0]}` : 'The Ultimate Student Task Board'}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                {user ? 'Ready to organize your tasks?' : 'Organize your academic life with a beautiful, intuitive board'}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 3,
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                {user ? 'Go to Board' : 'Get Started Free'}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
