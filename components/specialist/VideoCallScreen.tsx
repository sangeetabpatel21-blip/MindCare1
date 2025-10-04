import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Appointment } from '../../types';
import { ICONS } from '../../constants';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper functions for audio encoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


interface VideoCallScreenProps {
    appointment: Appointment;
    onEndCall: (transcript: string, audioUrl?: string) => void;
    // This prop will be passed from the parent to determine if the AI scribe should be active
    patientConsent: boolean; 
}

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ appointment, onEndCall, patientConsent }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const transcriptRef = useRef<HTMLDivElement>(null);
    const [transcript, setTranscript] = useState('');
    const { isRecording, startRecording, stopRecording, audioUrl } = useAudioRecorder();

    // AI Scribe State
    const [isAiScribeActive, setIsAiScribeActive] = useState(patientConsent);
    const [aiScribeStatus, setAiScribeStatus] = useState(patientConsent ? 'Connecting...' : 'Disabled');
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);

    // Effect to manage the Live AI Session
    useEffect(() => {
        if (!isAiScribeActive) {
            return;
        }

        let stream: MediaStream | null = null;
        let audioContext: AudioContext | null = null;
        let scriptProcessor: ScriptProcessorNode | null = null;

        const connectAILive = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // Use a ref for the session promise to avoid stale closures
                sessionPromiseRef.current = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                    callbacks: {
                        onopen: () => {
                            setAiScribeStatus('Listening...');
                            if (!stream) return;
                            
                            // FIX: Cast window to 'any' to allow access to vendor-prefixed webkitAudioContext for broader browser compatibility.
                            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                            const source = audioContext.createMediaStreamSource(stream);
                            scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                            
                            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                const pcmBlob = createBlob(inputData);
                                sessionPromiseRef.current?.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };
                            source.connect(scriptProcessor);
                            scriptProcessor.connect(audioContext.destination);
                        },
                        onmessage: (message: LiveServerMessage) => {
                            if (message.serverContent?.inputTranscription) {
                                const text = message.serverContent.inputTranscription.text;
                                setTranscript(prev => prev + text);
                            }
                        },
                        onerror: (e: ErrorEvent) => {
                            console.error('AI Scribe Error:', e);
                            setAiScribeStatus('Error');
                        },
                        onclose: (e: CloseEvent) => {
                            setAiScribeStatus('Disconnected');
                        },
                    },
                    config: {
                        responseModalities: [Modality.AUDIO], // Required for voice sessions
                        inputAudioTranscription: {}, // Enable transcription for user input audio.
                    },
                });

            } catch (error) {
                console.error("Failed to get microphone access:", error);
                setAiScribeStatus('Mic Error');
            }
        };

        connectAILive();
        
        // Cleanup function
        return () => {
            sessionPromiseRef.current?.then(session => session.close());
            stream?.getTracks().forEach(track => track.stop());
            scriptProcessor?.disconnect();
            audioContext?.close();
        };

    }, [isAiScribeActive]);


    useEffect(() => {
        // Start call timer
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        // Start recording for the audio file in parallel if consent is given
        if (patientConsent) {
            startRecording();
        }

        return () => {
            clearInterval(timer);
            if (isRecording) {
                stopRecording();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientConsent]); // Only run once on mount, based on initial consent

    useEffect(() => {
        // Auto-scroll transcript
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleEndCall = () => {
        stopRecording(); // This is for the downloadable audio file
        // A short delay to allow the audio blob to be created
        setTimeout(() => {
            onEndCall(transcript, audioUrl || undefined);
        }, 500);
    };

    const getAiScribeStatusBadge = () => {
        switch (aiScribeStatus) {
            case 'Listening...': return 'badge-success';
            case 'Connecting...': return 'badge-info';
            case 'Error':
            case 'Mic Error':
                 return 'badge-error';
            default: return 'badge-ghost';
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-800 text-white flex flex-col z-50">
            {/* Main Video Area */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
                {/* Patient View (Main) */}
                <div className="md:col-span-3 bg-gray-900 rounded-lg flex items-center justify-center relative">
                    <img src={appointment.specialist.avatarUrl.replace('s1', 'p1')} alt={appointment.patientName} className="w-32 h-32 rounded-full" />
                    <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">{appointment.patientName}</span>
                </div>

                {/* Specialist View (Picture-in-Picture) & Transcript */}
                <div className="flex flex-col space-y-2 h-full">
                    <div className="bg-gray-700 rounded-lg flex items-center justify-center h-48 relative">
                        <img src={appointment.specialist.avatarUrl} alt="Specialist" className="w-20 h-20 rounded-full" />
                        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">You (Dr. Sharma)</span>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg flex-grow flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-1 mb-2">
                            <h3 className="font-bold text-sm">Live Transcript</h3>
                            <span className={`badge badge-sm ${getAiScribeStatusBadge()}`}>{aiScribeStatus}</span>
                        </div>
                        <div ref={transcriptRef} className="text-xs text-gray-300 space-y-1 overflow-y-auto flex-grow pr-2">
                            <p style={{whiteSpace: 'pre-wrap'}}>{transcript || 'Transcript will appear here...'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 bg-opacity-80 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
                    {isRecording && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Recording Audio File"></span>}
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {ICONS.mic}
                    </button>
                    <button onClick={() => setIsCamOff(!isCamOff)} className={`p-3 rounded-full ${isCamOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {ICONS.video}
                    </button>
                </div>
                <button onClick={handleEndCall} className="btn btn-error">
                    End Call
                </button>
            </div>
        </div>
    );
};

export default VideoCallScreen;
