

import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { JournalEntry } from '../../types';
import Card from '../shared/Card';

const JournalScreen: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: 'j1', date: '2024-07-20', content: 'Felt a bit anxious today at work, but I managed to use the breathing exercises Dr. Sharma taught me. It helped.' },
    { id: 'j2', date: '2024-07-18', content: 'Had a good day. Spent time with friends and felt much more relaxed. It was nice to laugh.' },
  ]);
  const [newEntry, setNewEntry] = useState('');

  const handleSaveEntry = () => {
    if (newEntry.trim() === '') return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
      content: newEntry,
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <h3 className="text-lg font-bold text-neutral mb-2">New Journal Entry</h3>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="How are you feeling today?"
          className="w-full h-32 p-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-neutral"
        />
        <button
          onClick={handleSaveEntry}
          className="mt-2 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors"
        >
          Save Entry
        </button>
      </Card>

      <div>
        <h3 className="text-lg font-bold text-neutral mb-2">Past Entries</h3>
        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <p className="font-semibold text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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