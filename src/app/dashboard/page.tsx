'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Box, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import Recorder from '@/components/Recorder';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import SummaryEntry from '@/components/SummaryEntry';
import { generateSummary } from '@/lib/llm';
import { summaryService, Summary } from '@/lib/summaryService';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<Summary[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadSummaries();
    }
  }, [user]);

  const loadSummaries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const summaries = await summaryService.loadSummaries(user!.id);
      setEntries(summaries);
    } catch (error) {
      // Only set error if it's not a 404 (no data) error
      if (error instanceof Error && !error.message.includes('404')) {
        setError('Failed to load summaries');
        console.error('Error loading summaries:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingComplete = async (transcript: string) => {
    try {
      setCurrentTranscript(transcript);
      setIsProcessing(true);
      setError(null);
      
      const generatedSummary = await generateSummary(transcript);
      const newSummary = await summaryService.addSummary(user!.id, transcript, generatedSummary);
      
      setEntries(prev => [newSummary, ...prev]);
      setCurrentTranscript('');
    } catch (error) {
      setError('Failed to process recording');
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSummary = async (id: string) => {
    try {
      setError(null);
      await summaryService.removeSummary(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      setError('Failed to delete summary');
      console.error('Error deleting summary:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sync - Voice Standup Summarizer
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Recorder onRecordingComplete={handleRecordingComplete} />
        </Box>

        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {currentTranscript && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Recording
            </Typography>
            <TranscriptDisplay transcript={currentTranscript} />
          </Paper>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Previous Recordings
          </Typography>
          {entries.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              No recordings yet. Start by recording your first standup!
            </Typography>
          ) : (
            entries.map((entry) => (
              <SummaryEntry
                key={entry.id}
                summary={entry.summary}
                transcript={entry.transcript}
                timestamp={new Date(entry.created_at)}
                onDelete={() => handleDeleteSummary(entry.id)}
              />
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
} 