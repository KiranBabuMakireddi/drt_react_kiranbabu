import { useEffect, useState } from 'react';
import type { Satellite } from '../types/satellite';
import { useNavigate } from 'react-router-dom';

const SelectedPage = () => {
  const [selected, setSelected] = useState<Satellite[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('selected_satellites');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setSelected(parsed);
        }
      } catch (err) {
        console.error('Failed to parse selected satellites');
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        ← Back to Home
      </button>

      <h1 className="text-xl font-bold mb-4">Selected Satellites</h1>

      {selected.length === 0 ? (
        <p className="text-gray-500">No satellites selected.</p>
      ) : (
        <ul className="space-y-2">
          {selected.map((sat) => (
            <li
              key={sat.noradCatId}
              className="p-3 border rounded shadow-sm bg-white"
            >
              <strong>{sat.name}</strong> – NORAD ID: {sat.noradCatId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectedPage;
