import { Challenge } from '../../types/testCase';

interface ChallengeSelectorProps {
  challenges: Challenge[];
  selectedChallenge: Challenge | null;
  onSelectChallenge: (challenge: Challenge) => void;
}

export function ChallengeSelector({
  challenges,
  selectedChallenge,
  onSelectChallenge,
}: ChallengeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Challenge:</label>
      <select
        value={selectedChallenge?.id || ''}
        onChange={(e) => {
          const challenge = challenges.find((c) => c.id === e.target.value);
          if (challenge) onSelectChallenge(challenge);
        }}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {challenges.map((challenge) => (
          <option key={challenge.id} value={challenge.id}>
            {challenge.title} ({challenge.difficulty})
          </option>
        ))}
      </select>
    </div>
  );
}
