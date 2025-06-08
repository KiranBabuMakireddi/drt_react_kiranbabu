import { useEffect, useRef } from 'react';
import type { Satellite } from '../types/satellite';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';

interface Props {
  data: Satellite[];
  selected: Satellite[];
  setSelected: React.Dispatch<React.SetStateAction<Satellite[]>>;
}

const SkeletonRow = () => (
  <div className="grid grid-cols-[40px,1.2fr,1fr,1fr,1fr,1fr] animate-pulse px-4 py-2 border-b bg-gray-100">
    <div className="w-4 h-4 bg-gray-300 rounded mx-auto" />
    <div className="h-4 bg-gray-300 rounded w-3/4" />
    <div className="h-4 bg-gray-300 rounded w-2/3" />
    <div className="h-4 bg-gray-300 rounded w-2/3" />
    <div className="h-4 bg-gray-300 rounded w-2/3" />
    <div className="h-4 bg-gray-300 rounded w-2/3" />
  </div>
);

const SatelliteTable = ({ data, selected, setSelected }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Selected ${selected.length} satellite${selected.length !== 1 ? 's' : ''}`;
    }
  }, [selected]);

  const toggleSelection = (row: Satellite) => {
    const exists = selected.find((s) => s.noradCatId === row.noradCatId);
    if (exists) {
      setSelected(selected.filter((s) => s.noradCatId !== row.noradCatId));
    } else if (selected.length < 10) {
      setSelected([...selected, row]);
    } else {
      alert('You can only select up to 10 satellites.');
    }
  };

  return (
    <section aria-label="Satellite table" className="w-full">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-[#22af95]">Showing {data.length} satellites</p>
        <p className="text-sm text-[#22af95]">Selected: {selected.length}/10</p>
      </div>

      <div className="sr-only" role="status" aria-live="polite" ref={liveRef} />

      <div className="relative border rounded-lg overflow-hidden shadow">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[40px,1.2fr,1fr,1fr,1fr,1fr] items-center bg-gray-200 text-gray-900 text-sm font-bold px-4 py-3 sticky top-0 z-10 border-b">
              <input type="checkbox" className="mx-auto" disabled aria-hidden="true" />
              <span className="truncate">Name</span>
              <span className="truncate">NORAD ID</span>
              <span className="truncate">Orbit</span>
              <span className="truncate">Type</span>
              <span className="truncate">Country</span>
            </div>

            <div
              ref={parentRef}
              className="max-h-[400px] overflow-y-auto"
              tabIndex={0}
              aria-label="Satellite data scroll container"
            >
              <div
                style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
              >
                {rowVirtualizer.getVirtualItems().length === 0 ? (
                  Array.from({ length: 10 }).map((_, idx) => <SkeletonRow key={idx} />)
                ) : (
                  rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = data[virtualRow.index];
                    const isSelected = selected.some((s) => s.noradCatId === row.noradCatId);

                    return (
                      <div
                        key={row.noradCatId}
                        className={clsx(
                          'grid grid-cols-[40px,1.2fr,1fr,1fr,1fr,1fr] items-center px-4 py-2 text-sm border-b absolute left-0 right-0',
                          virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                          'focus-within:ring focus-within:ring-blue-200'
                        )}
                        style={{ transform: `translateY(${virtualRow.start}px)` }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(row)}
                          className="mx-auto accent-blue-500"
                          aria-label={`Select satellite ${row.name}`}
                        />
                        <span className="truncate text-gray-800 font-medium">{row.name}</span>
                        <span className="text-gray-700">{row.noradCatId}</span>
                        <span className="text-gray-700">{row.orbitCode || '-'}</span>
                        <span className="text-gray-700">{row.objectType}</span>
                        <span className="text-gray-700">{row.countryCode || '-'}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SatelliteTable;
