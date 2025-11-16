'use client';

import { useState } from "react";

const PEOPLE = [
  "Andrew", "Beth", "Carl", "Diane", "Edward",
  "Faye", "George", "Hannah", "Ian", "Jane",
];

const RESTRICTIONS: Record<string, string[]> = {
  Andrew: ["Beth"],
  Beth: ["Andrew"],
  Carl: ["Diane"],
  Diane: ["Carl"],
};

export const  HomeContainer = () => {
  const [remaining, setRemaining] = useState(PEOPLE);
  const [assigned, setAssigned] = useState<string | null>(null);
  const [pickerName, setPickerName] = useState("");

  const handlePick = () => {
    if (!pickerName) {
      alert("Please enter your name first.");
      return;
    }

    if (!remaining.includes(pickerName)) {
      alert("Your name is not in the list or you already picked!");
      return;
    }

    const restricted = RESTRICTIONS[pickerName] || [];
    const validTargets = remaining.filter(
      (p) => p !== pickerName && !restricted.includes(p)
    );

    if (validTargets.length === 0) {
      alert("No valid names left that you're allowed to pick.");
      return;
    }

    const chosen = validTargets[Math.floor(Math.random() * validTargets.length)];
    setAssigned(chosen);
    setRemaining(prev => prev.filter(p => p !== chosen && p !== pickerName));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">🎅 Secret Santa</h1>

        <label className="block mb-4">
          <span className="text-gray-600 mb-1 block">Your Name</span>
          <input
            type="text"
            className="w-full border rounded-xl p-3 focus:ring focus:ring-blue-200"
            value={pickerName}
            onChange={(e) => setPickerName(e.target.value)}
            placeholder="Enter your name…"
          />
        </label>

        <button
          onClick={handlePick}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Reveal My Person
        </button>

        {assigned && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-xl text-center">
            <p className="text-lg font-medium">You got:</p>
            <p className="text-2xl font-bold text-green-800 mt-1">{assigned}</p>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          No data is stored. Results disappear when you close the page.
        </p>
      </div>
    </div>
  );
}

export default HomeContainer;