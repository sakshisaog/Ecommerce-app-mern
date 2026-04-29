import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import Ourpolicy from '../components/OurPolicy'
import Newsletterbox from '../components/NewsLetterBox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <Ourpolicy />
      <Newsletterbox />
    </div>
  )
}

export default Home