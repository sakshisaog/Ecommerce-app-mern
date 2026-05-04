import React from 'react'

const NewsLetterBox = () => {

    const onSubmitHandler = (Event)=>{
        event.preventDefault();
    }
  return (
    <div className='text-center'>
    <p className='text-3xl font-medium text-gray-800'>subscibe now and get 20% OFF</p>
    <p className="textgray-400 mt-3">New drops, best deals—straight to your inbox.</p>
    <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex item-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none ' type="email" name="" placeholder='enter your email' required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
    </form>
    </div>
  )
}

export default NewsLetterBox