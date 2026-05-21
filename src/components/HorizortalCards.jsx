import React from 'react'
import { Link } from 'react-router-dom';
import Dropdown from './partials/Dropdown';

const HorizortalCards = ({data}) => {

  return (
    <>

        <div className='w-full h-[40vh] flex overflow-y-hidden '>
          { data.length>0 ? data.map((d,i)=>{
            const backgroundImageUrl = `https://image.tmdb.org/t/p/original${d.backdrop_path || d.poster_path || d.profile_path}`;
            return(
            <Link to={`/${d.media_type}/details/${d.id}`} key={i} className=' mb-2 min-w-[15%]  mr-5  bg-zinc-600' >
              <img  
                className='w-full h-[50%]  object-cover'
                src={`${backgroundImageUrl}`} alt="" />
      <div className='p-3 '>
      <h1 className='w-full font-semibold text-white '>
             {d.title||
                      d.name||
                        d.original_name ||
                          d.original_title
              }
             </h1>
                <p className=' text-xs text-zinc-100  '>
              {d.overview ? d.overview.slice(0,50) + '...' : 'No description available'}
              <Link className='text-zinc-400'>more</Link>
              </p>  
      </div>
          </Link>)}):<h1 className='text-3xl text-white font-black '>No data found</h1>} 
        </div>
    </>
  )
}

export default HorizortalCards
