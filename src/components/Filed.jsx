import React from 'react'

export default function Field({children, index, updateBoard}) {
    
  return (
    <div className='square' onClick={() => updateBoard(index)} key={index}>
        {children}
    </div>
  )
}
