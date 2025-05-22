'use client';

import { useState } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Collapse,
  Box,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

interface SummaryEntryProps {
  summary: {
    generalPoints: string[];
    individualPoints: Record<string, string[]>;
  };
  transcript: string;
  timestamp: Date;
  onDelete: () => void;
}

export default function SummaryEntry({ summary, transcript, timestamp, onDelete }: SummaryEntryProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={toggleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography variant="h6" component="div">
            {format(timestamp, 'MMM d, yyyy h:mm a')}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ ml: 2 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            General Points:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {summary.generalPoints.map((point, index) => (
              <Typography component="li" key={index} variant="body1">
                {point}
              </Typography>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Individual Points:
          </Typography>
          {Object.entries(summary.individualPoints).map(([name, points]) => (
            <Box key={name} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="primary">
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

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Transcript
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {transcript}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
} 