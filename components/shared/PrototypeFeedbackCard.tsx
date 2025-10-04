import React from 'react';
import Card from './Card';

const PrototypeFeedbackCard: React.FC = () => {
  return (
    <Card className="bg-blue-50 border border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="text-blue-500 mt-1 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-blue-800">Help Shape the Future of MindCare</h3>
          <p className="text-sm text-blue-700 mt-1">
            This application is a prototype designed to explore the future of mental healthcare. We are actively seeking feedback and suggestions from specialists and individuals with lived experience to help us build a truly impactful tool.
          </p>
          <a 
            href="mailto:feedback@MindCare.com?subject=MindCare%20Prototype%20Feedback" 
            className="btn btn-sm btn-info mt-3 text-white normal-case"
          >
            Share Your Feedback &amp; Suggestions
          </a>
        </div>
      </div>
    </Card>
  );
};

export default PrototypeFeedbackCard;