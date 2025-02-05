import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { FiShoppingCart } from "react-icons/fi";



const Header = () => {

    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()

    const redirectToLoginPage = ()=>{
        navigate("/login")
    }


  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 flex justify-center flex-col gap-1 bg-white'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-2 justify-between'>
                    {/* LOGO */}
                    <div className='h-full'>
                        <Link to={"/"}  className='h-full flex justify-center items-center'>
                            <img src={logo} className='w-28 h-16 sm:w-36 sm:h-10 lg:w-44 lg:h-15 block mx-auto' alt='logo'/>
                        </Link>
                    
                    </div>

                    {/* SEARCH */}
                    <div className='hidden lg:block'>
                        <Search/>
                    </div>

                    {/* LOGIN and ADD CART */}  
                    <div>
                        <button className='text-neutral-600 lg:hidden'>
                            <FaRegUserCircle size={25}/>
                        </button>
                        <div className='hidden lg:flex items-center gap-10'>
                            <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
                            <button className='flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-3 rounded text-white'>
                                {/* Add to cart icon */}
                                <div className='animate-bounce'>
                                    <FiShoppingCart size={25}/>
                                </div>
                                {/* Cart Items count & Price */}
                                <div className='font-semibold'>
                                    <p>My Cart</p>
                                </div>
                            </button>
                        </div>               
                    </div>
                </div>
            )
        }
        <div className='container mx-auto px-2 lg:hidden'>
            <Search/>
        </div>
        
    </header>
  )
}

export default Header
