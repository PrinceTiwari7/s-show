import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadmovie, removemovie } from "./store/actions/movieActions";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import HorizonalalCards from './HorizortalCards';

const Moviedetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { info } = useSelector((state) => state.movie);

  // ✅ Timeout guard: if info hasn't loaded after 12 seconds, show error
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
    dispatch(asyncloadmovie(id));

    // If data doesn't arrive in 12 seconds, bail out of loading
    const timer = setTimeout(() => setLoadFailed(true), 12000);

    return () => {
      clearTimeout(timer);
      dispatch(removemovie());
    };
  }, [id]);

  const backgroundImageUrl = info
    ? `https://image.tmdb.org/t/p/original${info.detail.backdrop_path}` : "";

  const { pathname } = useLocation();

  // ── Error Screen ──────────────────────────────────────────
  if (loadFailed && !info) {
    return (
      <div className='w-full h-screen flex flex-col justify-center items-center bg-zinc-900'>
        <i className="ri-error-warning-line text-red-400 text-6xl mb-4"></i>
        <h1 className='text-white text-2xl font-bold mb-2'>Failed to load movie</h1>
        <p className='text-zinc-400 text-center mb-6'>Could not fetch details. Please check your connection.</p>
        <div className="flex gap-4">
          <button
            onClick={() => { setLoadFailed(false); dispatch(asyncloadmovie(id)); setTimeout(() => setLoadFailed(true), 12000); }}
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
          <p className='text-zinc-400'>Loading movie details...</p>
        </div>
      </div>
    );
  }

  // ── Main Content ──────────────────────────────────────────
  return (
    <div
      style={{
        background: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.5),rgba(0,0,0,.7)),url(${backgroundImageUrl})`,
        backgroundPosition: "top 10%",
        backgroundSize: "cover",
      }}
      className="w-full min-h-screen px-[10%] py-4 relative"
    >
      {/* Nav */}
      <nav className="w-full text-zinc-100 flex gap-10 text-xl">
        <Link><i onClick={() => navigate(-1)} className="mr-2 hover:text-[#1da1f2] text-2xl ri-arrow-left-line"></i></Link>
        <a target="_blank" href={info.detail.homepage}><i className="ri-external-link-fill"></i></a>
        <a href={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}><i className="ri-earth-fill"></i></a>
        <a href={`https://www.imdb.com/title/${info.externalid.imdb_id}`}>imdb</a>
      </nav>

      {/* Image and details */}
      <div className="flex p-5">
        <img
          className='w-[36vh] shadow-lg object-cover h-[49vh]'
          src={`https://image.tmdb.org/t/p/original${info.detail.poster_path}`}
          alt={info.detail.title}
        />
        <div className="ml-8">
          <h1 className='text-[40px] font-semibold text-white text-center mt-2'>
            {info.detail.title || info.detail.original_title}
            {info.detail.release_date &&
              <small className="text-xl"> ({info.detail.release_date.split("-")[0]})</small>
            }
          </h1>

          <div className="flex mt-5 gap-5">
            <div className='w-16 h-16 font-semibold text-2xl flex justify-center items-center rounded-full bg-yellow-500'>
              {(info.detail.vote_average * 10).toFixed()}<sup>%</sup>
            </div>
            <h1 className="mt-5 text-zinc-50">User Score — {info.detail.release_date}</h1>
            <h1 className="mt-2 text-white text-[20px] ml-4">
              {info.detail.genres.map(g => g.name).join(", ")}
            </h1>
            <h1 className="mt-2 text-white text-[20px] ml-4">{info.detail.runtime}min</h1>
          </div>

          <div>
            <div className="flex gap-24 mt-2">
              <h1 className="text-[30px] text-white italic ml-10 mt-4">{info.detail.tagline}</h1>
              <Link
                className="text-white text-3xl mt-2 px-5 py-2 bg-[#6556cd] text-center rounded"
                to={`${pathname}/trailer`}
              >
                <i className="mr-2 ri-play-fill" />Play Trailer
              </Link>
            </div>
            <h1 className="text-[20px] text-white ml-10 mt-4">Overview</h1>
            <p className="text-white ml-10 mt-2">{info.detail.overview}</p>
            <h1 className="text-blue-300 text-[20px] ml-10 mt-2">Translations</h1>
            <p className="text-white ml-10 mt-2">{info.translations.join(", ")}</p>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Recommendations */}
      <h1 className="text-white text-2xl ml-5 m-5 text-center">Recommendations & Similar</h1>
      <HorizonalalCards data={info.recommendations.length > 0 ? info.recommendations : info.similar} />

      <Outlet />

      {/* Watch Providers */}
      {info.watchproviders && info.watchproviders.flatrate && (
        <div className="w-full flex gap-3 mt-4">
          {info.watchproviders.flatrate.map((w, i) => (
            <img key={i}
              className="w-12 h-12 rounded"
              src={`https://image.tmdb.org/t/p/original${w.logo_path}`}
              alt={w.provider_name}
              title={w.provider_name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Moviedetails;
