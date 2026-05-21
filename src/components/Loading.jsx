import React from 'react';
import loader from '/loader.gif'

const Loading = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-black'>
      { <img src={loader} alt="" /> }

      {/* <div class="container">
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
</div> */}

      
    </div>
  )
}

export default Loading
