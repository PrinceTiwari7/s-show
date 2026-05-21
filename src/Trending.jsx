import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topnav from './components/partials/Topnav';
import Dropdown from './components/partials/Dropdown';
import axios from './utils/Axios';   // ✅ fixed import path
import Cards from './components/partials/Cards';
import Loading from './components/Loading';
import InfiniteScroll from 'react-infinite-scroll-component';

const Trending = () => {

    document.title = 'S-Show | Trending';
    const navigate = useNavigate();

    const [trending, setTrending] = useState([]);
    const [category, setCategory] = useState('all');
    const [duration, setDuration] = useState('day');
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        resetTrending();
    }, [category, duration]);

    const resetTrending = async () => {
        setTrending([]);
        setPage(1);
        setHasMore(true);
        fetchTrending(1, true);
    };

    const fetchTrending = async (pageToFetch, isReset = false) => {
        try {
            // ✅ fixed: removed broken `?page={page}` literal from URL, use params only
            const { data } = await axios.get(`/trending/${category}/${duration}`, {
                params: { page: pageToFetch }
            });

            if (data.results.length > 0) {
                setTrending(prev => isReset ? data.results : [...prev, ...data.results]);
                setPage(pageToFetch + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.log('Error fetching trending data:', error);
        }
    };

    return (
        <div className='p-[3%] w-screen h-screen overflow-y-auto'>
            <div className='w-full flex items-center'>
                <i
                    onClick={() => navigate(-1)}
                    className="mr-2 text-[#1da1f2] text-2xl ri-arrow-left-line"
                ></i>
                <h1 className='text-2xl'>Trending</h1>
                <Topnav />
                <Dropdown title="Category" options={['movie', 'tv', 'all']} func={setCategory} />
                <Dropdown title="Duration" options={['week', 'day']} func={setDuration} />
            </div>
            <InfiniteScroll
                dataLength={trending.length}
                next={() => fetchTrending(page)}
                hasMore={hasMore}
                loader={<h4 className="text-white text-center">Loading...</h4>}
                endMessage={<p className="text-white text-center">No more results</p>}
                scrollThreshold={0.4}
            >
                <Cards data={trending} title={category} />
            </InfiniteScroll>
        </div>
    );
};

export default Trending;
