import React, { useState } from 'react';

interface SpecialistProfileSetupScreenProps {
  userId: string;
  initialName: string;
  onDone: () => void; // call this after successful save
}

interface MhsProfile {
  userId: string;
  fullName: string;
  city: string;
  profession: string;
  degrees: string;
  registrationNumber: string;
  council: string;
  experienceYears: number;
  languages: string[];
  about: string;
  focusAreas: string[];
}

const SpecialistProfileSetupScreen: React.FC<SpecialistProfileSetupScreenProps> = ({
  userId,
  initialName,
  onDone
}) => {
  const [fullName, setFullName] = useState(initialName);
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [degrees, setDegrees] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [council, setCouncil] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [languages, setLanguages] = useState('');
  const [about, setAbout] = useState('');
  const [focusAreas, setFocusAreas] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        'https://mindcare-backend-8r24.onrender.com/mhs/profile',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            fullName,
            city,
            profession,
            degrees,
            registrationNumber,
            council,
            experienceYears:
              experienceYears === '' ? 0 : Number(experienceYears),
            languages: languages
              .split(',')
              .map(l => l.trim())
              .filter(Boolean),
            about,
            focusAreas: focusAreas
              .split(',')
              .map(f => f.trim())
              .filter(Boolean)
          } satisfies Partial<MhsProfile> & { userId: string })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not save profile');
      } else {
        setMessage(
          'Profile saved. Verification: Not verified by MindCare yet.'
        );
        onDone();
      }
    } catch (e) {
      console.error(e);
      setError('Network error, please try again');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">
        Complete your professional profile
      </h1>
      <p className="text-xs text-gray-500">
        This helps people understand who you are. MindCare will also show
        whether your profile is verified or not, so they can make informed
        choices.
      </p>

      <input
        className="input input-bordered w-full"
        placeholder="Full name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="City"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Profession (e.g., Clinical Psychologist)"
        value={profession}
        onChange={e => setProfession(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Degrees (e.g., M.Phil Clinical Psychology)"
        value={degrees}
        onChange={e => setDegrees(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Registration / licence number"
        value={registrationNumber}
        onChange={e => setRegistrationNumber(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Council / board (e.g., RCI, state council)"
        value={council}
        onChange={e => setCouncil(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Years of experience"
        type="number"
        value={experienceYears}
        onChange={e => setExperienceYears(e.target.value as any)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Languages (comma separated)"
        value={languages}
        onChange={e => setLanguages(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Short about you"
        value={about}
        onChange={e => setAbout(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Areas of focus (comma separated)"
        value={focusAreas}
        onChange={e => setFocusAreas(e.target.value)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {isSaving && <p className="text-xs text-gray-500">Saving profile…</p>}
      {message && <p className="text-xs text-green-600">{message}</p>}

      <button
        className="btn btn-primary w-full"
        onClick={handleSave}
        disabled={isSaving}
      >
        Save profile
      </button>
    </div>
  );
};

export default SpecialistProfileSetupScreen;
