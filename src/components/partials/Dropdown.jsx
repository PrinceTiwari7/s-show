import React from 'react';

const Dropdown = ({ title, options, func }) => {
  return (
    <div className="select mb-3 mr-12 ">
      <select onChange={(e) => func(e.target.value)} defaultValue="0" name="format" id="format">
        <option value="0" disabled>
          {title}
        </option>
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;



// import React from 'react'

// const Dropdown = ({title,options,func}) => {

//   return (
//     <div >
//       <div className="select mb-3">
// <select onChange={(e) => func(e.target.value)} defaultValue="0" name="format" id="format">
// <option value="0" disabled>
// {title}
// </option>

// {options.map((o,i)=>(
//     <option key={i} value={o}>
//     {o.toUpperCase()}
//     </option>
// ))}


// </select>
// </div>
//     </div>
//   )
// }

// export default Dropdown



