'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface WelcomeDialogProps {
  open: boolean;
  onSubmit: (userName: string) => void;
}

export default function WelcomeDialog({ open, onSubmit }: WelcomeDialogProps) {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedName = userName.trim();

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }

    onSubmit(trimmedName);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: '90%', sm: 400 },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
          <TrendingUpIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" component="span" color="primary.main">
            Stock Manager
          </Typography>
        </Box>
        <Typography variant="h6" component="div" color="text.secondary">
          Welcome! 👋
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={3}
          textAlign="center"
        >
          To get started, what should we call you?
        </Typography>

        <TextField
          autoFocus
          fullWidth
          label="Your name"
          variant="outlined"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            if (error) setError(''); // Clear error when user types
          }}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error || 'This will be displayed in your portfolio'}
          placeholder="e.g. John, Sarah, Alex..."
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          size="large"
          disabled={!userName.trim()}
          sx={{ py: 1.5 }}
        >
          Let's Go! 🚀
        </Button>
      </DialogActions>
    </Dialog>
  );
}
