import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {

const [showMenu, setShowMenu] = useState(false);

const handleNavBarClick = () => {
  setShowMenu(!showMenu);
  console.log(showMenu);
}


return (
  <>
    <header className="bg-primaryBg">
      <div className="flex justify-between items-center p-2">
        <button onClick={() => handleNavBarClick()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 className="text-primaryText text-2xl mx-2">Habit Builder</h1>
      </div>
      {showMenu &&
      (<nav className="bg-secondaryBg">
        <ul className="py-2 text-lg">
            <li className="p-1 ps-3 hover:text-highlight text-secondaryText">
                <Link to={'/'} onClick={() => handleNavBarClick()}>Home</Link>
            </li>
            <li className="border-y p-1 ps-3 hover:text-highlight text-secondaryText">
                <Link to={'/new-habit'} onClick={() => handleNavBarClick()}>New Habit</Link>
            </li>
            <li className="p-1 ps-3 hover:text-highlight text-secondaryText">
                <Link to={'/login'} onClick={() => handleNavBarClick()}>Login</Link>
            </li>
            <li className="border-y p-1 ps-3 hover:text-highlight text-secondaryText">
                <Link to={'/register'} onClick={() => handleNavBarClick()}>Register</Link>
            </li>
            <li className="p-1 ps-3 hover:text-highlight text-secondaryText">
                Logout
            </li>
        </ul>
      </nav>)}
    </header>
  </>
)
}
  
  export default Header
  