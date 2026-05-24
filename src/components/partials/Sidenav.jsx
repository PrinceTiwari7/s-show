import React from 'react'
import { Link } from 'react-router-dom'

const Sidenav = () => {
  return (
      <div className="left w-[20%] h-full border-2px border-r-4 py-10 px-10" >
        <h1 className='text-2xl   '>
        <i className="text-[#6556CD] ri-tv-fill fill-purple-400 font-bold mr-3"></i>
            <span className='text-white'>S-SHOW</span>
        </h1>

        <nav className='flex flex-col text-zinc-400'>
            <h1 className='text-xl text-white font-semibold mt-5 mb-5 '>
                New Feeds
                </h1>

            <Link to="/trending" className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 ">
            <i className="mr-2  ri-fire-line"></i>
              Trending
            </Link>    
            <Link to="/popular" className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 ">
            <i className="mr-2  ri-bard-line"></i>
              Popular
            </Link>    
            <Link to='movie' className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 ">
            <i className="mr-2  ri-movie-2-line"></i>
            Movies
            </Link>    
            <Link to='tvshow' className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 " >
            <i  className="mr-2 ri-tv-line"></i>
            TV shows
            </Link>    
            <Link to='people' className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 ">
            <i className="mr-2  ri-team-fill"></i>
            People
            </Link>    
        </nav>

        <hr className='h-[1px] bg-transparent'/>
        <nav className='flex flex-col text-zinc-400'>
            <h1 className='text-xl text-white font-semibold mt-5 mb-5 '>
                Website Information
                </h1>

            <Link className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 ">
            <i className="mr-2 ri-information-line"></i>
              About
            </Link>    
            <Link className="p-5 hover:bg-[#6556CD] hover:text-white rounded-lg duration-300 ">
            <i className="mr-2 ri-phone-line"></i>
              Contact Us
            </Link>    
               
        </nav>
      </div>
  )
}

export default Sidenav
