import NavBarMobile from './components/layout/nav/NavBarMobile'
import NavBarDesktop from './components/layout/nav/NavBarDesktop'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { NewHabitProvider } from './contexts/NewHabitContext'

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
        <UserProvider>
            <NewHabitProvider>
                {showMobile && <div className='grid grid-flow-row grid-rows-12 h-[100vh]'>
                    <div className='row-span-1'>
                        <NavBarMobile />
                    </div>
                    <div className='row-span-11'>
                        <Outlet />
                    </div>
                </div>}

                {!showMobile && <div className='grid grid-cols-5 h-[100vh]'>
                    <div className='fixed col-span-1'>
                        <NavBarDesktop />
                    </div>
                    <div className='col-span-4 col-start-2 mx-2'>
                        <Outlet />
                    </div>
                </div>}
            </NewHabitProvider>
        </UserProvider>
    )
}

export default App
