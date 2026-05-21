import React from 'react'
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Notfound from '../store/Notfound';

const Trailer = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const category = pathname.includes("movie") ? 'movie': 'tv';
    const ytvideo = useSelector(state=>state[category].info.videos);

//console.log(ytvideo);
  return (
    <div className='bg-[rgba(0,0,0,.6)] w-screen h-screen flex items-center justify-center absolute top-0 left-0'>
       
         <Link>
          <i
            onClick={() => navigate(-1)}
            className="mr-2 hover:text-[#1da1f2] text-3xl ri-close-fill absolute right-6 text-white top-3 "
          ></i>
        </Link>

     {ytvideo ?  <ReactPlayer 
        width={1400}
        height={600}
            url={`https://www.youtube.com/watch?v=${ytvideo.key}`}
      />:<Notfound/>}
    </div>
  )
}

export default Trailer
