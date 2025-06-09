// import { useNavigate } from 'react-router-dom';
import type { Satellite } from '../types/satellite';
import { FaTimes } from 'react-icons/fa';

interface SelectedSidebarProps {
  selected: Satellite[];
  setSelected: (items: Satellite[]) => void;
}

const SelectedSidebar = ({ selected, setSelected }: SelectedSidebarProps) => {
  // const navigate = useNavigate();

  const handleRemove = (id: string) => {
  setSelected(selected.filter((s) => s.noradCatId !== id));
};


  const handleClear = () => {
    setSelected([]);
  };

  // const handleProceed = () => {
  //   localStorage.setItem('selected_satellites', JSON.stringify(selected));
  //   navigate('/selected');
  // };

  return (
    <div className="w-72 h-full bg-[#0e0f1a] text-white p-4 flex flex-col border-l border-[#1f2233]">
      <h3 className="text-lg font-semibold mb-3">Selected Assets</h3>

      {/* Header row */}
      {selected.length > 0 && (
        <div className="flex justify-between items-center mb-2 text-sm text-blue-400 border border-blue-500 px-3 py-1 rounded">
          <span>{selected.length} objects selected</span>
          <button onClick={handleClear} className="flex items-center gap-1 text-red-400 hover:text-red-500">
            Clean all <FaTimes className="text-xs" />
          </button>
        </div>
      )}

      {/* List of selected items */}
      <div className="flex-1 overflow-y-auto border border-[#2c2f40] rounded p-2 space-y-2">
        {selected.map((s) => (
          <div
            key={s.noradCatId}
            className="flex items-center justify-between bg-[#1c1e2b] px-3 py-1.5 rounded text-sm hover:bg-[#2a2c3e]"
          >
            <span className="text-blue-300 font-mono w-10">{s.noradCatId}</span>
            <span className="flex-1 text-white truncate mx-2">{s.name}</span>
            <button onClick={() => handleRemove(s.noradCatId)} className="text-red-400 hover:text-red-500">
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      {/* Proceed button */}
      <button
        // onClick={handleProceed}
        disabled={selected.length === 0}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-center font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        PROCEED
      </button>
    </div>
  );
};

export default SelectedSidebar;
