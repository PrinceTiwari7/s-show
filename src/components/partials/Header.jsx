import React from 'react'
import { Link } from 'react-router-dom';

const Header = ({data}) => {
  const backgroundImageUrl = data ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '';
  return (
    <div
    style={{
      
      background:`linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.5),rgba(0,0,0,.7)) ,
      url(${backgroundImageUrl})`,
      backgroundPosition:"top 10%",
      backgroundSize:"cover"
    }}
    className='w-full h-[50vh] flex flex-col  justify-end p-[7%] items-start '>
          <h1 className='font-black text-5xl text-zinc-300'>{ data.title ||
                data.name||
                data.original_name||
                data.original_title}
                </h1>
             <p className=' text-2xl text-zinc-400 mb-3 ml-3'>
              {data.overview.slice(0,150)}...
              <Link to={`/${data.media_type}/details/${data.id}`} className='text-blue-400'>more</Link>
              </p>  

                <p className='text-white gap-x-3'>
                <i className="text-yellow-400 ri-mic-off-fill"></i>{" "}
                  {data.release_date || data.first_air_date || "No Release Info"}
                  <i className="ml-2 text-yellow-400 ri-movie-2-line"></i>
                  {data.media_type.toUpperCase()}
                </p> 

                <Link 
                 to={`/${data.media_type}/details/${data.id}/trailer`}
                className='text-white bg-zinc-400 p-4  rounded'>Watch Trailer</Link>
    </div>
  )
}

export default Header
