import React, { useEffect, useState, useCallback } from 'react';
import VoiceVisualizer from './VoiceVisualizer';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { sendChatMessageStream } from '../../services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import { ICONS } from '../../constants';

interface VoiceModeProps {
  onExit: () => void;
  onTurnEnd: (userText: string, botText: string) => void;
}

const VoiceMode: React.FC<VoiceModeProps> = ({ onExit, onTurnEnd }) => {
  const [botResponse, setBotResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { isListening, transcript, startListening, stopListening, isSupported, error } = useSpeechRecognition();

  const speak = useCallback((text: string) => {
    if (!text || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
        setIsSpeaking(true);
        if (isListening) stopListening();
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      startListening();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [isListening, stopListening, startListening]);

  const handleSendQuery = useCallback(async (text: string) => {
    if (!text) return;

    setIsProcessing(true);
    setBotResponse('');

    try {
      const stream = await sendChatMessageStream(text);
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullResponse += chunkText;
        }
      }
      setBotResponse(fullResponse);
      onTurnEnd(text, fullResponse);
      speak(fullResponse);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg = 'Sorry, I encountered an error. Please try again.';
      setBotResponse(errorMsg);
      onTurnEnd(text, errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }, [speak, onTurnEnd]);

  useEffect(() => {
    if (!isListening && transcript && !isProcessing && !isSpeaking) {
      handleSendQuery(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);
  
  useEffect(() => {
    startListening();
    return () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        stopListening();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isListening) return transcript || "I'm listening...";
    if (isProcessing) return "Thinking...";
    if (isSpeaking) return botResponse;
    if (!isSupported) return "Speech recognition is not supported in your browser.";
    return "Tap the microphone to speak.";
  };
  
  const handleMicClick = () => {
      if (isListening) {
          stopListening();
      } else if (!isSpeaking && !isProcessing) {
          startListening();
      }
  };

  return (
    <div className="fixed inset-0 bg-base-100 z-50 flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-end">
        <button onClick={onExit} className="btn btn-ghost">
          Exit Voice
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow space-y-6 w-full max-w-md text-center">
        <p className="text-xl text-neutral font-medium h-24 px-4 overflow-y-auto">
          {getStatusText()}
        </p>
        <VoiceVisualizer isListening={isListening} isProcessing={isProcessing} />
      </div>

      <div className="h-24 flex items-center justify-center">
        <button 
            onClick={handleMicClick}
            disabled={isSpeaking || isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 disabled:opacity-50
              ${isListening ? 'bg-red-500 shadow-lg' : 'bg-primary shadow-md'}`
            }
        >
          <div className="text-white h-8 w-8">
            {ICONS.mic}
          </div>
        </button>
      </div>
    </div>
  );
};

export default VoiceMode;