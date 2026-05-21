import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadperson, removeperson } from "./store/actions/personActions";
import { Link, useNavigate, useParams } from "react-router-dom";
import HorizonalalCards from './HorizortalCards';
import Loading from './Loading';

const Peopledetails = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { info } = useSelector((state) => state.person);

  // ✅ Timeout guard: if info hasn't loaded after 12 seconds, show error
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
    dispatch(asyncloadperson(id));

    // If data doesn't arrive in 12 seconds, bail out of loading
    const timer = setTimeout(() => setLoadFailed(true), 12000);

    return () => {
      clearTimeout(timer);
      dispatch(removeperson());
    };
  }, [id]);

  const backgroundImageUrl = info
    ? `https://image.tmdb.org/t/p/original${info.detail.profile_path}` : "";

  // ── Error Screen ──────────────────────────────────────────
  if (loadFailed && !info) {
    return (
      <div className='w-full h-screen flex flex-col justify-center items-center bg-zinc-900'>
        <i className="ri-error-warning-line text-red-400 text-6xl mb-4"></i>
        <h1 className='text-white text-2xl font-bold mb-2'>Failed to load Person</h1>
        <p className='text-zinc-400 text-center mb-6'>Could not fetch details. Please check your connection.</p>
        <div className="flex gap-4">
          <button
            onClick={() => { setLoadFailed(false); dispatch(asyncloadperson(id)); setTimeout(() => setLoadFailed(true), 12000); }}
            className='bg-[#6556CD] text-white px-8 py-3 rounded-lg hover:bg-[#7b6de0] transition-colors duration-200 font-semibold'
          >
            <i className="ri-refresh-line mr-2"></i>Retry
          </button>
          <button
            onClick={() => navigate(-1)}
            className='bg-zinc-700 text-white px-8 py-3 rounded-lg hover:bg-zinc-600 transition-colors duration-200 font-semibold'
          >
            <i className="ri-arrow-left-line mr-2"></i>Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Loading Screen ────────────────────────────────────────
  if (!info) {
    return (
      <div className='w-full h-screen flex justify-center items-center bg-zinc-900'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-[#6556CD] border-t-transparent rounded-full animate-spin'></div>
          <p className='text-zinc-400'>Loading person details...</p>
        </div>
      </div>
    );
  }

  // ── Main Content ──────────────────────────────────────────
  return (
    <div className="w-full h-screen p-[5%] flex">
      <div className="div1 w-20% bg-orange-500">
        {/* p1 */}
        <nav className=" text-zinc-100 flex gap-10 text-xl">
          <Link>
            <i
              onClick={() => navigate(-1)}
              className="mr-2 hover:text-[#1da1f2]  text-2xl ri-arrow-left-line"
            ></i>
          </Link>
        </nav>

        {/* p2 */}
        <div>
          <img
            className='w-[36vh] mt-9 shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)] object-cover h-[49vh]'
            src={backgroundImageUrl}
            alt={info.detail.name}
          />

          <hr className=" bg-neutral-700 border-2 mt-2 w-60" />

          <div className="text-2xl text-white gap-4 flex">
            <a href={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}>
              <i className=" ri-earth-fill"></i>
            </a>
            <a href={`https://www.facebook.com/${info.externalid.facebook_id}`}>
              <i className=" ri-facebook-circle-fill"></i>
            </a>
            <a href={`https://www.instagram.com/${info.externalid.instagram_id}`}>
              <i className=" ri-instagram-fill"></i>
            </a>
            <a href={`https://www.twitter.com/${info.externalid.twitter_id}`}>
              <i className=" ri-twitter-x-fill"></i>
            </a>
          </div>
          <h1 className="text-2xl text-black mt-4">Personal Information</h1>
          <h1 className="text-xl text-zinc-400 mt-2">Known {info.detail.known_for_department}</h1>
          <h1 className="text-xl text-zinc-400 ">Name {info.detail.name}</h1>
          <h1 className="text-xl text-zinc-400 ">Birth place {info.detail.place_of_birth}</h1>
        </div>
      </div>

      <div className="bg-yellow-900 w-[80%]">
        <h1 className=" text-2xl  text-zinc-300 ml-5 mt-5">Biography</h1>
        <p className="  text-zinc-300 p-[5%]">{info.detail.biography}</p>
      </div>
    </div>
  );
}

export default Peopledetails;
