import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topnav from './partials/Topnav';
import Dropdown from './partials/Dropdown';
import axiosInstance from '../utils/Axios';
import Cards from './partials/Cards';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';

const Movie = () => {

    document.title = 'S-Show | Movie';

    const navigate = useNavigate();
    const [movie, setmovie] = useState([]);
    const [category, setCategory] = useState('now_playing');
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    // ✅ explicit isLoading boolean — prevents blank screen on initial load
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
        setmovie([]);
        setPage(1);
        setHasMore(true);
        setIsLoading(true);
        setError(null);
        fetchmovie(1, true);
    }, [category]);

    const fetchmovie = async (pageToFetch, isReset = false) => {
        try {
            const { data } = await withRetry(() => axiosInstance.get(`/movie/${category}`, {
                params: { page: pageToFetch }
            }));

            if (data.results.length > 0) {
                setmovie(prevmovie => isReset ? data.results : [...prevmovie, ...data.results]);
                setPage(pageToFetch + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.log('Error fetching movie data:', err);
            setError('Failed to load movies. Please try again.');
            setHasMore(false);
        } finally {
            if (isReset) setIsLoading(false);
        }
    };

    const fetchMoreData = () => {
        fetchmovie(page);
    };

    // ── Error Screen ──────────────────────────────────────────
    if (error) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center bg-zinc-900'>
                <i className="ri-error-warning-line text-red-400 text-6xl mb-4"></i>
                <h1 className='text-white text-2xl font-bold mb-2'>Failed to load Movies</h1>
                <p className='text-zinc-400 text-center mb-6'>{error}</p>
                <button
                    onClick={() => { setError(null); setIsLoading(true); fetchmovie(1, true); }}
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
                        Movies
                    </h1>
                    <h5 className='text-teal-200'>({category})</h5>
                    <Topnav />
                    <Dropdown
                        title="Category"
                        options={['popular', 'top_rated', 'upcoming', 'now_playing']}
                        func={setCategory}
                    />
                </div>
                <InfiniteScroll
                    dataLength={movie.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4 className="text-white text-center py-4">Loading...</h4>}
                    endMessage={<p className="text-white text-center py-4">No more results</p>}
                    scrollThreshold={0.4}
                >
                    <Cards data={movie} title="movie" />
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default Movie;
