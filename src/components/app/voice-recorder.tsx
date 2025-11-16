'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { processVoiceMemoToList } from '@/ai/flows/process-voice-memo-to-list';
import { generateListTitle } from '@/ai/flows/generate-list-title';
import { cn } from '@/lib/utils';

type VoiceRecorderProps = {
  onNewList: (title: string, items: string[]) => void;
  setProcessing: (isProcessing: boolean) => void;
};

export default function VoiceRecorder({ onNewList, setProcessing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: 'destructive',
        title: 'Audio Recording Not Supported',
        description: 'Your browser does not support this feature.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        setIsTranscribing(true);
        setProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            
            const { listItems } = await processVoiceMemoToList({ audioDataUri: base64Audio });
            
            if (listItems && listItems.length > 0) {
              const { title } = await generateListTitle({ listContent: listItems.join(', ') });
              onNewList(title, listItems);
            } else {
              toast({
                title: 'No items found',
                description: "We couldn't find any list items in your recording. Please try again.",
              });
            }
          };
        } catch (error) {
          console.error('Error processing voice memo:', error);
          toast({
            variant: 'destructive',
            title: 'An Error Occurred',
            description: 'Failed to process your voice memo. Please try again.',
          });
        } finally {
          setIsTranscribing(false);
          setProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access in your browser settings.',
      });
    }
  };

  if (!isClient) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-sm border-t z-30 flex justify-center items-center h-[148px]">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-sm border-t z-30 flex justify-center items-center h-[148px]">
      {isTranscribing ? (
        <div className="flex flex-col items-center gap-2 text-primary">
          <LoaderCircle className="h-10 w-10 animate-spin" />
          <p className="text-lg font-medium">Creating your list...</p>
        </div>
      ) : (
        <Button
          onClick={handleRecording}
          disabled={isTranscribing}
          className={cn(
            'w-32 h-32 rounded-full shadow-2xl text-primary-foreground transition-all duration-300 transform hover:scale-105',
            isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90',
            isRecording && 'pulse-record'
          )}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <Square className="h-16 w-16 fill-current" />
          ) : (
            <Mic className="h-20 w-20" />
          )}
        </Button>
      )}
    </div>
  );
}
