import { Box, Typography, Paper, Divider } from '@mui/material';

interface SummaryOutputProps {
  summary: {
    generalPoints: string[];
    individualPoints: Record<string, string[]>;
  } | null;
}

export default function SummaryOutput({ summary }: SummaryOutputProps) {
  if (!summary) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Standup Summary
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            General Points:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {summary.generalPoints.map((point, index) => (
              <Typography component="li" key={index} variant="body1">
                {point}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Individual Points:
          </Typography>
          {Object.entries(summary.individualPoints).map(([name, points]) => (
            <Box key={name} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                {name}:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {points.map((point, index) => (
                  <Typography component="li" key={index} variant="body1">
                    {point}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
} 