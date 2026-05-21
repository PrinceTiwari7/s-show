import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topnav from './partials/Topnav';
import axiosInstance from '../utils/Axios';
import Cards from './partials/Cards';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';

const People = () => {

    document.title = 'S-Show | People';

    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    // ✅ explicit isLoading boolean — not derived from array length
    const [isLoading, setIsLoading] = useState(true);

    // Auto-retry wrapper: retries fn up to (attempts) times silently
    const withRetry = async (fn, attempts = 2) => {
        for (let i = 0; i < attempts; i++) {
            try { return await fn(); }
            catch (err) {
                if (i < attempts - 1) await new Promise(r => setTimeout(r, 800));
                else throw err;
            }
        }
    };
    const [error, setError] = useState(null);

    useEffect(() => {
        setPeople([]);
        setPage(1);
        setHasMore(true);
        setIsLoading(true);
        setError(null);
        fetchPeople(1, true);
    }, []);

    const fetchPeople = async (pageToFetch, isReset = false) => {
        try {
            const { data } = await withRetry(() => axiosInstance.get('/person/popular', {
                params: { page: pageToFetch }
            }));

            if (data.results.length > 0) {
                setPeople(prevPeople => isReset ? data.results : [...prevPeople, ...data.results]);
                setPage(pageToFetch + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.log('Error fetching popular people data:', err);
            setError('Failed to load people. Please try again.');
            setHasMore(false);
        } finally {
            // Always stop the initial loading spinner after first fetch attempt
            if (isReset) setIsLoading(false);
        }
    };

    const fetchMoreData = () => {
        fetchPeople(page);
    };

    // ── Error Screen ──────────────────────────────────────────
    if (error) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center bg-zinc-900'>
                <i className="ri-error-warning-line text-red-400 text-6xl mb-4"></i>
                <h1 className='text-white text-2xl font-bold mb-2'>Failed to load People</h1>
                <p className='text-zinc-400 text-center mb-6'>{error}</p>
                <button
                    onClick={() => { setError(null); setIsLoading(true); fetchPeople(1, true); }}
                    className='bg-[#6556CD] text-white px-8 py-3 rounded-lg hover:bg-[#7b6de0] transition-colors duration-200 font-semibold'
                >
                    <i className="ri-refresh-line mr-2"></i>Retry
                </button>
            </div>
        );
    }

    // ── Loading Screen ────────────────────────────────────────
    if (isLoading) return <Loading />;

    // ── Main Content ──────────────────────────────────────────
    return (
        <div>
            <div className='p-[3%] w-screen h-screen overflow-y-auto'>
                <div className='w-full flex items-center'>
                    <i
                        onClick={() => navigate(-1)}
                        className="mr-2 text-[#1da1f2] text-2xl ri-arrow-left-line"
                    ></i>
                    <h1 className='text-2xl w-[10%] inline-block '>
                        People
                    </h1>
                    <Topnav />
                </div>
                <InfiniteScroll
                    dataLength={people.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4 className="text-white text-center">Loading...</h4>}
                    endMessage={<p className="text-white text-center">No more results</p>}
                    scrollThreshold={0.4}
                >
                    <Cards data={people} title="person" />
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default People;
