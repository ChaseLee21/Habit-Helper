import Footer from './components/Footer'
import NavBarMobile from './components/nav/NavBarMobile'
import NavBarDesktop from './components/nav/NavBarDesktop'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

function App () {
    const [width, setWidth] = useState(window.innerWidth)
    const [showMobile, setShowMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (width < 768) {
            setShowMobile(true)
        } else {
            setShowMobile(false)
        }
    }, [width])

    return (
        <>
            {showMobile && <div className=''>
                <NavBarMobile />
                <Outlet />
                <Footer />
            </div>}

            {!showMobile &&
                <div className='grid grid-cols-5'>
                    <div className='col-span-1'>
                        <NavBarDesktop />
                    </div>
                    <div className='col-span-4'>
                        <Outlet />
                    </div>
                </div>
            }
        </>
    )
}

export default App
