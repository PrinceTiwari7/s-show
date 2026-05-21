  import React from 'react'
  import { Route, Routes } from 'react-router-dom'
  import Home from './components/Home'
  import Trending from './Trending'
  import Popular from './components/Popular'
  import Movie from './components/Movie'
  import Tv_show from './components/Tv_show'
  import People from './components/People'
  import Moviedetails from './components/Moviedetails'
  import Tvdetails from './components/Tvdetails'
  import Peopledetails from './components/Peopledetails'
import Populardetails from './components/Populardetails'
import Trailer from './components/partials/Trailer'
import Notfound from './components/store/Notfound'

  const App = () => {
    return (
      <div className='bg-zinc-700'>
        
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route  path="/trending" element={<Trending/>}></Route>
        <Route  path="/popular" element={<Popular/>}></Route>
        <Route  path="/movie" element={<Movie/>}></Route>
        <Route  path="/tvshow" element={<Tv_show/>}> </Route>
        <Route  path="/people" element={<People/>}></Route>
        <Route path='/tv/details/:id' element={<Tvdetails/>}>
        <Route path='/tv/details/:id/trailer' element={<Trailer/>}></Route>
         </Route>
        <Route path='/people/details/:id' element={<Peopledetails/>}/>
        <Route path='/movie/details/:id' element={<Moviedetails/>}>
          <Route path='/movie/details/:id/trailer' element={<Trailer/>}></Route>
        </Route>
        <Route path='/popular/details/:id' element={<Populardetails/>}/>
        
      <Route path='*' element={<Notfound/>}></Route>
      </Routes> 


      </div>
    )
  }

  export default App
