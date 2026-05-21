import React from 'react';
import { Link } from 'react-router-dom';

const Cards = ({ data, title }) => {
    return (
        <div className='flex flex-wrap w-full'>
            {data.map((c, i) => {
                const backgroundImageUrl = `https://image.tmdb.org/t/p/original${c.backdrop_path || c.poster_path || c.profile_path}`;
                // ✅ fixed: use c.media_type (per-item) not data.media_type (array has no media_type)
                const mediaType = c.media_type || title;
                return (
                    <Link
                        to={`/${mediaType}/details/${c.id}`}
                        key={i}
                        className='relative w-[20vw] h-[60vh] mb-[2%] mt-[3%] mr-[3%]'
                    >
                        <img
                            className='w-[100%] shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)] object-cover h-[90%]'
                            src={backgroundImageUrl}
                            alt={c.name || c.original_name || c.original_title || c.title}
                        />
                        <h1 className='text-2xl text-white text-center mt-2'>
                            {c.title || c.name || c.original_name || c.original_title}
                        </h1>
                        {c.vote_average > 0 && (
                            <div className='w-16 h-16 font-semibold text-2xl absolute right-[-8%] bottom-[30%] flex justify-center items-center rounded-full bg-yellow-500'>
                                {(c.vote_average * 10).toFixed()}<sup>%</sup>
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default Cards;
