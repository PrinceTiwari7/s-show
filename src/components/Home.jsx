import React, { useEffect, useState } from 'react'
import Sidenav from './partials/Sidenav';
import Topnav from './partials/Topnav';
import axios from '../utils/Axios';
import Header from './partials/Header';
import HorizortalCards from './HorizortalCards';
import Dropdown from './partials/Dropdown';
import Loading from './Loading';

const Home = () => {
    document.title = 'S-Show | Homepage';

    const [wallpaper, setwallpaper] = useState(null);
    const [trending, settrending] = useState(null);
    const [category, setCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Auto-retry wrapper: tries fn up to (attempts) times ──────────────
    const withRetry = async (fn, attempts = 2) => {
        for (let i = 0; i < attempts; i++) {
            try {
                return await fn();
            } catch (err) {
                if (i < attempts - 1) {
                    // Wait 800ms between retries
                    await new Promise(r => setTimeout(r, 800));
                } else {
                    throw err;
                }
            }
        }
    };

    // Client-side timeout helper: rejects if fn takes longer than ms
    const withTimeout = (fn, ms = 10000) =>
        Promise.race([
            fn(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Cannot reach the movie database.")), ms)
            ),
        ]);

    const loadData = async (currentWallpaper) => {
        setIsLoading(true);
        setError(null);
        try {
            // Wallpaper: only fetch once (or on explicit retry)
            if (!currentWallpaper) {
                const { data } = await withTimeout(() => axios.get('/trending/all/day'));
                const randomdata = data.results[Math.floor(Math.random() * data.results.length)];
                setwallpaper(randomdata);
            }
            // Trending: fetch on every category change
            const { data } = await withTimeout(() => axios.get(`/trending/${category}/day`));
            settrending(data.results);
        } catch (err) {
            console.log("Error loading home:", err);
            const message = err?.response?.data?.error || err?.message || "Failed to load content.";
            setError(`⚠️ ${message} — Please check your internet connection or try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData(wallpaper);
    }, [category]);

    // ── Error Screen ──────────────────────────────────────────────────────
    if (error) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center bg-zinc-900'>
                <i className="ri-error-warning-line text-red-400 text-6xl mb-4"></i>
                <h1 className='text-white text-2xl font-bold mb-2'>Something went wrong</h1>
                <p className='text-zinc-400 text-center max-w-md mb-6'>{error}</p>
                <button
                    onClick={() => { setwallpaper(null); loadData(null); }}
                    className='bg-[#6556CD] text-white px-8 py-3 rounded-lg hover:bg-[#7b6de0] transition-colors duration-200 font-semibold'
                >
                    <i className="ri-refresh-line mr-2"></i>Retry
                </button>
            </div>
        );
    }

    // ── Loading Screen ────────────────────────────────────────────────────
    if (isLoading || !wallpaper || !trending) {
        return <Loading />;
    }

    // ── Main Content ──────────────────────────────────────────────────────
    return (
        <div className='w-full h-screen flex overflow-auto overflow-x-hidden'>
            <Sidenav />
            <div className="right w-[80%] h-full">
                <Topnav />
                <Header data={wallpaper} />
                <div className='flex justify-between p-10'>
                    <div className='text-2xl font-semibold text-white text-center'>
                        Trending
                    </div>
                    <Dropdown title="Filter" options={["tv", "movie", "all"]} func={(value) => setCategory(value)} />
                </div>
                <HorizortalCards data={trending} />
            </div>
        </div>
    );
}

export default Home
