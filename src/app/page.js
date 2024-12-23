// src/app/page.js

import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-100">
      {/* <Header /> */}
      
      <div className="container mx-auto mt-8 px-4">
        <section className="mb-12">
          <div className="relative h-96 rounded-lg overflow-hidden">
            {/* <Image src="/placeholder-hero.jpg" alt="Swimming pool" layout="fill" objectFit="cover" /> */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-white text-4xl font-bold text-center">BRANDEIS swimming lessons</h1>
            </div>
          </div>
        </section>

        <section className="mb-12 text-black">
          <h2 className="text-3xl font-bold mb-4">Registration Information</h2>
          <p className="mb-4">Registration for the Fall sessions will open on Tuesday, August 6 at 10:00AM</p>
          <p className="font-bold">Stay Safe.</p>
        </section>

        <section className="mb-12 text-black">
          <h2 className="text-3xl font-bold mb-4">Swimming Lessons</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="mb-4">
                During the college academic year, swimming lessons are offered at Tufts
                University&#39;s Hamilton Pool as a fundraiser for the Men&#39;s and Women&#39;s
                Swimming and Diving teams. These fundraisers help support the team&#39;s winter
                break training camp, a vital part of the season.
              </p>
              <p>
                All of the staff - instructors, lifeguards, and on deck personal - are members
                of the team. These lessons occur before and after our season, in September and
                April, and are intended to provide the community with an opportunity to improve
                comfort and confidence in the water.
              </p>
            </div>
            {/* <div className="flex-1">
              <Image src="/placeholder-lesson.jpg" alt="Swimming lesson" width={600} height={400} className="rounded-lg" />
            </div> */}
          </div>
        </section>

        <section className="mb-12 text-black">
          <h2 className="text-3xl font-bold mb-4">General Information</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2">You will not receive a reminder that lessons are beginning, so please be sure to mark in your calendar after you receive your email registration confirmation.</li>
            <li className="mb-2">We operate under Tufts University Academic Calendar and will have lessons scheduled even if they fall on otherwise recognized holidays and public and private school vacations.</li>
            <li className="mb-2">There is no required equipment other than full coverage bathing suits, although goggles are highly encouraged for all levels, especially for those in levels 3-5.</li>
            <li className="mb-2">Sleeved shirts/bathing suits are NOT recommended for learn to swim lessons unless wearing them for religious or personal reasons.</li>
            <li>LONG HAIR SHOULD BE TIED BACK and SICK children should be left home!</li>
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  )
}