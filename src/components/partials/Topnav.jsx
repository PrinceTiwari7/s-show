import axios from '../../utils/Axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import noimage from '/noimage.png';

const Topnav = () => {

    const [query, setquery] = useState("");
    const [searches, setsearches] = useState([]);

    const Getsearches = async () => {
        try {
            // ✅ fixed: use params instead of inline query string to avoid encoding issues
            const { data } = await axios.get('/search/multi', {
                params: { query }
            });
            setsearches(data.results);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        if (query.length > 0) {
            Getsearches();
        } else {
            setsearches([]);
        }
    }, [query]);

    return (
        <div className='w-full h-[10vh] flex items-center relative justify-start pl-[20%]'>
            <i className="text-white text-2xl ri-search-line"></i>
            <input
                type="text"
                onChange={(e) => setquery(e.target.value)}
                value={query}
                placeholder='Search Anything'
                className='outline-none p-5 w-[50%] bg-transparent text-zinc-200 mx-10'
            />
            {query.length > 0 &&
                <i
                    onClick={() => setquery("")}
                    className="text-white text-2xl ri-close-line">
                </i>}

            <div className='w-[50%] max-h-[50vh] z-[100] bg-white top-[100%] absolute overflow-auto'>
                {searches.map((s, i) => (
                    <Link
                        key={i}
                        to={`/${s.media_type}/details/${s.id}`}
                        onClick={() => setquery("")}
                        className='hover:text-black hover:bg-zinc-300 duration-300 w-full bg-zinc-200 border-b-2 text-zinc-600 border-zinc-100 p-10 flex justify-start items-center'
                    >
                        <img
                            className='w-[10vh] h-[10vh] object-cover bg-center mr-8 rounded'
                            // ✅ fixed: removed newline in URL template string
                            src={
                                s.backdrop_path || s.profile_path
                                    ? `https://image.tmdb.org/t/p/original${s.backdrop_path || s.profile_path}`
                                    : noimage
                            }
                            alt=""
                        />
                        {/* ✅ fixed: s.tittle typo → s.title */}
                        <span>{s.title || s.name || s.original_name || s.original_title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Topnav;
