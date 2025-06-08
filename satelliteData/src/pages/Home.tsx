import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from 'react';
import { fetchSatellites } from '../services/api';
import type { Satellite } from '../types/satellite';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import SelectedSidebar from '../components/SelectedSidebar';

const SatelliteTable = lazy(() => import('../components/SatelliteTable'));

const Home = () => {
  const [data, setData] = useState<Satellite[]>([]);
  const [selected, setSelected] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<{
    objectTypes: string[];
    orbitCodes: string[];
  }>({
    objectTypes: ['PAYLOAD', 'ROCKET BODY', 'DEBRIS', 'UNKNOWN'],
    orbitCodes: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const satellites = await fetchSatellites(filters, [
          'name',
          'noradCatId',
          'orbitCode',
          'objectType',
          'countryCode',
          'launchDate',
        ]);
        setData(satellites);
        setError('');
      } catch {
        setError('Failed to load satellites.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q.trim());
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nameMatch =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.noradCatId.includes(query);

      const itemType = item.objectType || 'UNKNOWN';
      const orbitList = (item.orbitCode || 'UNKNOWN')
        .replace(/[{}]/g, '')
        .split(',')
        .map((code) => code.trim().toUpperCase());

      const typeMatch =
        filters.objectTypes.length === 0 ||
        filters.objectTypes.includes(itemType);

      const orbitMatch =
        filters.orbitCodes.length === 0 ||
        orbitList.some((code) => filters.orbitCodes.includes(code));

      return nameMatch && typeMatch && orbitMatch;
    });
  }, [data, filters, query]);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto relative">
        <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">
          Create My Asset List
        </h1>

        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-4">
          <Filters
            filters={filters}
            setFilters={setFilters}
            data={data}
          />
        </div>

        {error ? (
          <p className="mt-8 text-center text-red-400" role="alert">
            {error}
          </p>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            {loading && (
              <div className="mt-8 absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <p className="text-gray-500 animate-pulse">Loading data...</p>
              </div>
            )}
            <Suspense
              fallback={
                <div className="text-center text-gray-400 mt-4 animate-pulse">
                  Preparing table...
                </div>
              }
            >
              <SatelliteTable
                data={filteredData}
                selected={selected}
                setSelected={setSelected}
              />
            </Suspense>
          </div>
        )}
      </div>

      <div className="hidden lg:block w-[320px] bg-gray-50 border-l border-gray-200 sticky top-0 h-screen overflow-y-auto">
        <SelectedSidebar selected={selected} setSelected={setSelected}/>
      </div>
    </div>
  );
};

export default Home;
