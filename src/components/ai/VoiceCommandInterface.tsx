import React, { useState, useEffect } from "react";
import { Mic, MicOff, Play, Square } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { motion } from "framer-motion";

interface VoiceCommandInterfaceProps {
  onCommand?: (command: string) => void;
  isListening?: boolean;
  onToggleListening?: () => void;
}

const VoiceCommandInterface = ({
  onCommand = () => {},
  isListening = false,
  onToggleListening = () => {},
}: VoiceCommandInterfaceProps) => {
  const [transcript, setTranscript] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [visualizerValues, setVisualizerValues] = useState<number[]>(
    Array(10).fill(5),
  );

  // Simulate microphone activity with random values
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVisualizerValues(
          Array(10)
            .fill(0)
            .map(() => Math.floor(Math.random() * 30) + 5),
        );
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVisualizerValues(Array(10).fill(5));
    }
  }, [isListening]);

  const handleToggleMic = () => {
    onToggleListening();
    if (!isListening) {
      setTranscript("");
      setIsRecording(true);
      // Simulate receiving a voice command after 3 seconds
      setTimeout(() => {
        const exampleCommands = [
          "Add task: Complete project proposal by Friday",
          "Mark task 'Send email to client' as complete",
          "What are my high priority tasks?",
          "Reschedule meeting task to tomorrow",
        ];
        const randomCommand =
          exampleCommands[Math.floor(Math.random() * exampleCommands.length)];
        setTranscript(randomCommand);
        onCommand(randomCommand);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    onToggleListening();
  };

  return (
    <div className="w-full h-full bg-card p-4 rounded-lg shadow-md border border-border dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-medium">Voice Commands</h3>

        {/* Voice visualizer */}
        <div className="flex items-end justify-center h-16 w-full space-x-1 mb-2">
          {visualizerValues.map((value, index) => (
            <motion.div
              key={index}
              className="w-2 bg-primary rounded-t"
              initial={{ height: 5 }}
              animate={{ height: isListening ? value : 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          ))}
        </div>

        {/* Transcript display */}
        <div className="w-full min-h-[60px] p-3 bg-muted rounded-md text-sm">
          {transcript
            ? transcript
            : isListening
              ? "Listening..."
              : "Say a command..."}
        </div>

        {/* Control buttons */}
        <div className="flex space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="icon"
                  onClick={handleToggleMic}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isListening ? "Stop listening" : "Start listening"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isRecording && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStopRecording}
                  >
                    <Square size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop recording</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {transcript && !isListening && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onCommand(transcript)}
                  >
                    <Play size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Execute command</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground mt-2">
          Try saying: "Add task", "Complete task", or "List my tasks"
        </p>
      </div>
    </div>
  );
};

export default VoiceCommandInterface;
