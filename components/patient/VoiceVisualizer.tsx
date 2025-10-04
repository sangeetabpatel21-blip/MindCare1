import React from 'react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isProcessing: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, isProcessing }) => {
  const baseOrbClasses = "w-40 h-40 bg-primary rounded-full transition-all duration-500 flex items-center justify-center";

  return (
    <div className="orb-container">
      {/* Background Rings for listening animation */}
      <div className={isListening ? 'orb-rings-listening' : ''}>
        <div className="orb-ring orb-ring-1 w-full h-full"></div>
        <div className="orb-ring orb-ring-2 w-full h-full"></div>
        <div className="orb-ring orb-ring-3 w-full h-full"></div>
      </div>
      
      {/* Thinking Gradient */}
      {isProcessing && (
        <div className="absolute w-44 h-44">
           <div className="orb-thinking-gradient"></div>
        </div>
      )}

      {/* Central Orb */}
      <div className={`${baseOrbClasses} ${isListening ? 'orb-pulse' : ''} ${isProcessing ? 'scale-95' : 'scale-100'}`}>
          {/* You could place an icon inside the orb here if desired */}
      </div>
    </div>
  );
};

export default VoiceVisualizer;