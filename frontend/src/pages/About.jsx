import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div className=' text-center  pt-10 border-t  '>
      <div className="text-2xl text-center pt-2 border-none ">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-26">
        <img src={assets.about_img} className='w-full h-190 md:max-w-[450px] ' alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-1/2 text-gray-600">
        <p className="">We create pieces that feel effortless and easy to wear. Clean fits, balanced tones, and styles that naturally become part of your everyday.</p>
        <p className="">Our approach is built around comfort, quality, and versatility. Every piece is made to be worn on repeat, styled in your own way, and kept beyond just one season. We believe your wardrobe should feel like you—simple, consistent, and something you can rely on.</p>
        <b className=" text-gray-600"> OUR MISSION</b>
        <p>To create fashion that feels natural, confident, and easy—so you can express your style in a way that’s effortless, personal, and true to you.
        </p>
        </div>
      </div>
      <div className="text-4xl py-4 ">
        <Title  text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className="flex flex-col md:flex-row text-sm gap-5">
        <div className="border px-10 md:px-15 py-8 sm:py-20 flex flex-col gap-5  ">
          <b>Quality That Lasts</b>
          <p className="text-gray-600 ">We focus on well-made pieces with attention to fabric, fit, and finish, so your clothes stay in your rotation longer.</p>
        </div>
        <div className="border px-10 md:px-15 py-8 sm:py-20 flex flex-col gap-5  ">
          <b>Effortless Style</b>
          <p className="text-gray-600 ">Clean designs and versatile pieces that are easy to wear, mix, and style for everyday looks.</p>
        </div>
        <div className="border px-10 md:px-15 py-8 sm:py-20 flex flex-col gap-5  ">
          <b>Made for Everyday</b>
          <p className="text-gray-600 ">Comfortable, wearable, and designed to move with your lifestyle without compromising on style.</p>
        </div>
      </div>
    <div className="mt-15">
      <NewsLetterBox />
    </div>
    </div>
  )
}

export default About