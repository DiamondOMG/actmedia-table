"use client"
import React from 'react'


// import layout from '@/components/Layout'
import Header from '@/components/Layout/Header'
import SidebarLeft from '@/components/Layout/SidebarLeft'
import Footer from '@/components/Layout/Footer'

function page() {
  return (
    <div>
        <Header/>
        <SidebarLeft/>
        <Footer/>   
    </div>
  )
}

export default page