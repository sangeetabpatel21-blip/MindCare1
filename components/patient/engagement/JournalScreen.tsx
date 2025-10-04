import React, { useState } from 'react';
// FIX: Corrected import path from ../../ to ../../../
import { JournalEntry } from '../../../types';
// FIX: Corrected import path from ../../ to ../../../
import Card from '../../shared/Card';
// FIX: Corrected import path from ../../ to ../../../
import { JOURNAL_COLORS, JOURNAL_PATTERNS, MOODS } from '../../../constants';

const JournalScreen: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: 'j1', date: '2024-07-20', content: 'Felt a bit anxious today at work, but I managed to use the breathing exercises Dr. Sharma taught me. It helped.', mood: '😟', color: '#F0FDFA', pattern: 'pattern-dots' },
    { id: 'j2', date: '2024-07-18', content: 'Had a good day. Spent time with friends and felt much more relaxed. It was nice to laugh.', mood: '😊', color: '#FEFCE8', pattern: '' },
  ]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string>(JOURNAL_COLORS[0]);
  const [selectedPattern, setSelectedPattern] = useState<string>(JOURNAL_PATTERNS[0].class);

  const handleSaveEntry = () => {
    if (newEntry.trim() === '') return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-CA'),
      content: newEntry,
      mood: selectedMood,
      color: selectedColor,
      pattern: selectedPattern,
    };
    
    setEntries([entry, ...entries]);
    // Reset form
    setNewEntry('');
    setSelectedMood(undefined);
    setSelectedColor(JOURNAL_COLORS[0]);
    setSelectedPattern(JOURNAL_PATTERNS[0].class);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-lg font-bold text-neutral mb-2">New Journal Entry</h3>
        <div style={{ backgroundColor: selectedColor }} className={`p-2 rounded-lg transition-colors ${selectedPattern}`}>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write whatever is on your mind. Don't worry about grammar or spelling—just let your thoughts flow in any language you're comfortable with."
            className="w-full h-32 p-2 bg-transparent border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-neutral"
          />
        </div>

        <div className="mt-3 space-y-3">
            <div>
                <label className="text-sm font-semibold text-gray-600">How are you feeling?</label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {MOODS.map(mood => (
                        <button key={mood.name} onClick={() => setSelectedMood(mood.icon)} className={`text-2xl p-1 rounded-full transition-transform transform hover:scale-125 ${selectedMood === mood.icon ? 'bg-primary-light ring-2 ring-primary' : ''}`}>
                            {mood.icon}
                        </button>
                    ))}
                </div>
            </div>

             <div>
                <label className="text-sm font-semibold text-gray-600">Background Color</label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {JOURNAL_COLORS.map(color => (
                        <button key={color} onClick={() => setSelectedColor(color)} style={{ backgroundColor: color }} className={`w-8 h-8 rounded-full border border-gray-300 transition-transform transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                    ))}
                </div>
            </div>
             <div>
                <label className="text-sm font-semibold text-gray-600">Background Pattern</label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {JOURNAL_PATTERNS.map(pattern => (
                        <button key={pattern.name} onClick={() => setSelectedPattern(pattern.class)} className={`px-3 py-1 text-sm border rounded-full transition-colors ${selectedPattern === pattern.class ? 'bg-primary text-white' : 'bg-base-200 text-neutral'}`}>
                            {pattern.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <button
          onClick={handleSaveEntry}
          className="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors"
        >
          Save Entry
        </button>
      </Card>

      <div>
        <h3 className="text-lg font-bold text-neutral mb-2">Past Entries</h3>
        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className={`${entry.pattern || ''}`} style={{ backgroundColor: entry.color || '#FFFFFF' }}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {entry.mood && <span className="text-2xl">{entry.mood}</span>}
                </div>
                <p className="text-gray-700 mt-1">{entry.content}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">You have no journal entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default JournalScreen;