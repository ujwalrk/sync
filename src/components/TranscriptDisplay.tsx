import { Box, Typography, Paper } from '@mui/material';

interface TranscriptDisplayProps {
  transcript: string;
}

export default function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Transcript
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          minHeight: 150,
          maxHeight: 300,
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {transcript || 'No transcript available yet...'}
        </Typography>
      </Paper>
    </Box>
  );
} 