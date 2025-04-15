import React from 'react'

function Loader() {
  let style = {
    color: 'red',
    background: 'black',
  }
  return (
    <div className='loader' style={style}>
      <p></p>
    </div>
  )
}

export default Loader
