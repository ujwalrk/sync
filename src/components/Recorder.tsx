import { useState, useRef, useEffect } from 'react';
import { Button, Box, Typography, TextField, Snackbar, Alert, LinearProgress, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

interface RecorderProps {
  onRecordingComplete: (transcript: string) => void;
}

export default function Recorder({ onRecordingComplete }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [processingStatus, setProcessingStatus] = useState<{
    isProcessing: boolean;
    message: string;
    progress: number;
  }>({
    isProcessing: false,
    message: '',
    progress: 0
  });
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
  const stopRecognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const updateProcessingStatus = (message: string, progress: number) => {
    setProcessingStatus({
      isProcessing: true,
      message,
      progress
    });
  };

  const clearProcessingStatus = () => {
    setProcessingStatus({ isProcessing: false, message: '', progress: 0 });
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (stopRecognitionTimeoutRef.current) {
      clearTimeout(stopRecognitionTimeoutRef.current);
      stopRecognitionTimeoutRef.current = null;
    }
  };

  const initializeSpeechRecognition = () => {
    console.log('Browser check:', {
      isChrome,
      userAgent: navigator.userAgent,
      hasWebkitSpeechRecognition: 'webkitSpeechRecognition' in window
    });

    if (!isChrome) {
      showToast('Speech recognition works best in Chrome browser', 'error');
      return null;
    }

    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API not supported in this browser');
      showToast('Speech recognition not supported in this browser', 'error');
      return null;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      showToast('Speech recognition started', 'success');
      retryCountRef.current = 0;
      updateProcessingStatus('Speech recognition active', 25);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(final + interim);
      updateProcessingStatus('Processing speech...', 50);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      stopRecognition();
      clearProcessingStatus();

      if (event.error === 'network') {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          showToast(`Network error detected. Retrying (${retryCountRef.current}/${MAX_RETRIES})...`, 'error');
          updateProcessingStatus(`Retrying connection (${retryCountRef.current}/${MAX_RETRIES})...`, 75);
          
          stopRecognitionTimeoutRef.current = setTimeout(() => {
            if (isRecording) {
              const newRecognition = initializeSpeechRecognition();
              if (newRecognition) {
                try {
                  newRecognition.start();
                  recognitionRef.current = newRecognition;
                } catch (error) {
                  console.error('Failed to restart recognition:', error);
                  showToast('Failed to restart speech recognition', 'error');
                  clearProcessingStatus();
                }
              }
            }
          }, 2000 * retryCountRef.current);
        } else {
          showToast('Network error: Please check your internet connection and try again.', 'error');
        }
      } else if (event.error === 'no-speech' || event.error === 'audio-capture') {
         if (isRecording) {
            showToast(`Speech input error: ${event.error}. Restarting...`, 'info');
             stopRecognitionTimeoutRef.current = setTimeout(() => {
                const newRecognition = initializeSpeechRecognition();
                if (newRecognition) {
                   try {
                     newRecognition.start();
                     recognitionRef.current = newRecognition;
                   } catch (error) {
                      console.error('Failed to restart recognition after no-speech/audio-capture:', error);
                      showToast('Failed to restart speech recognition', 'error');
                      clearProcessingStatus();
                   }
                }
             }, 1000);
         }
      }
       else {
        showToast(`Speech recognition error: ${event.error}`, 'error');
      }
    };

    recognition.onend = () => {
       console.log('Speech recognition ended.');
      if (isRecording && retryCountRef.current < MAX_RETRIES) {
        showToast('Speech recognition ended unexpectedly. Attempting restart...', 'info');
         updateProcessingStatus('Restarting speech recognition...', 75);
         stopRecognitionTimeoutRef.current = setTimeout(() => {
           const newRecognition = initializeSpeechRecognition();
           if (newRecognition) {
             try {
               newRecognition.start();
                recognitionRef.current = newRecognition;
             } catch (error) {
                console.error('Failed to restart recognition from onend:', error);
                showToast('Failed to restart speech recognition', 'error');
                 clearProcessingStatus();
             }
           }
         }, 1000);
      } else if (isRecording && retryCountRef.current >= MAX_RETRIES) {
         showToast('Speech recognition failed to restart after multiple attempts.', 'error');
         clearProcessingStatus();
      }
    };

    return recognition;
  };

  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, []);

  const startRecording = async () => {
    if (isRecording) return;

    try {
      updateProcessingStatus('Initializing...', 10);
      showToast('Requesting microphone access...', 'info');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia not supported');
        showToast('Microphone access not supported in this browser', 'error');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted:', stream.getAudioTracks()[0].label);
      showToast('Microphone access granted', 'success');
      updateProcessingStatus('Microphone access granted', 20);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      const recognition = initializeSpeechRecognition();
      if (recognition) {
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          showToast('Failed to start speech recognition', 'error');
          clearProcessingStatus();
        }
      } else {
        clearProcessingStatus();
      }

      mediaRecorder.start();
      setIsRecording(true);
      showToast('Recording started', 'success');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      showToast('Failed to access microphone. Please check permissions.', 'error');
      clearProcessingStatus();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      showToast('Stopping recording...', 'info');
      updateProcessingStatus('Stopping recording...', 80);
      
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      setTimeout(() => {
        if (liveTranscript.trim()) {
          onRecordingComplete(liveTranscript);
        } else {
          showToast('No speech was detected. Please try again.', 'error');
        }
        setLiveTranscript('');
        clearProcessingStatus();
      }, 500);
    }
    retryCountRef.current = 0;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h6" component="h2">
        {isRecording ? 'Recording...' : 'Ready to Record'}
      </Typography>
      <Button
        variant="contained"
        color={isRecording ? 'error' : 'primary'}
        onClick={isRecording ? stopRecording : startRecording}
        startIcon={isRecording ? <StopIcon /> : <MicIcon />}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {isRecording && (
        <TextField
          label="Live Speech-to-Text"
          value={liveTranscript}
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          sx={{ mt: 2, width: 400 }}
          InputProps={{ readOnly: true }}
        />
      )}
      {processingStatus.isProcessing && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" value={processingStatus.progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {`${Math.round(processingStatus.progress)}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {processingStatus.message}
          </Typography>
        </Box>
      )}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 