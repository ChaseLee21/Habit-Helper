import { useState, React } from 'react'
import { Link } from 'react-router-dom'

function Header () {
    const [showMenu, setShowMenu] = useState(false)

    const handleNavBarClick = () => {
        setShowMenu(!showMenu)
    }

    return (
        <>
            <header className="bg-colorPrimary text-colorText">
                <div className="flex justify-between items-center p-2">
                    <button onClick={() => handleNavBarClick()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <h1 className="text-colorLink hover:text-colorLinkHover text-2xl mx-2">
                        <Link to={'/'} onClick={() => handleNavBarClick()}>Habit Tracker</Link>
                    </h1>
                </div>
                {showMenu && (<nav className="bg-colorBg text-colorLink">
                    <ul className="py-2 text-lg">
                        {document.cookie.includes('habitTrackerToken') &&
                            <li className="border-b p-1 ps-3 hover:text-colorLinkHover">
                                <Link to={'/'} onClick={() => handleNavBarClick()}>Home</Link>
                            </li>
                        }
                        {document.cookie.includes('habitTrackerToken') &&
                            <li className="border-b p-1 ps-3 hover:text-colorLinkHover">
                                <Link to={'/profile'} onClick={() => handleNavBarClick()}>My Profile</Link>
                            </li>
                        }
                        {document.cookie.includes('habitTrackerToken') &&
                            <li className="border-b p-1 ps-3 hover:text-colorLinkHover">
                                <Link to={'/new-habit'} onClick={() => handleNavBarClick()}>New Habit</Link>
                            </li>
                        }
                        {!document.cookie.includes('habitTrackerToken') &&
                            <li className="border-b p-1 ps-3 hover:text-colorLinkHover">
                                <Link to={'/register'} onClick={() => handleNavBarClick()}>Register</Link>
                            </li>
                        }
                        {!document.cookie.includes('habitTrackerToken') &&
                        <li className="p-1 ps-3 hover:text-colorLinkHover">
                            <Link to={'/login'} onClick={() => handleNavBarClick()}>Login</Link>
                        </li>
                        }
                        {document.cookie.includes('habitTrackerToken') &&
                            <li className="p-1 ps-3 hover:text-colorLinkHover">
                                <Link to={'/logout'} onClick={() => handleNavBarClick()}>Logout</Link>
                            </li>
                        }
                    </ul>
                </nav>)}
            </header>
        </>
    )
}

export default Header
