import React,{useState} from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";
import UserMenu from './UserMenu';
import { useGlobalContext } from '../provider/GlobalProvider';
import { BsCart4 } from "react-icons/bs";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import DisplayCartItem from './DisplayCartItem';




const Header = () => {

    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()

    const user = useSelector((state)=> state?.user)
    const cartItem = useSelector(state => state.cartItem.cart)

    const { totalPrice, totalQty} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
 

    const [openUserMenu,setOpenUserMenu] = useState(false)

    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }

        navigate("/user")
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
                    <div className=''>
                        <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                            <FaRegUserCircle size={25}/>
                        </button>
                        <div className='hidden lg:flex items-center gap-10'>
                            {
                                user?._id ? (
                                    <div>
                                        <div onClick={()=>setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                                            <p>Account</p>
                                            {
                                                openUserMenu ? (
                                                        <GoTriangleUp size={25}/> 
                                                ) : (
                                                    <GoTriangleDown size={25}/>
                                                )
                                            }
                                        </div>
                                        {
                                            openUserMenu && (
                                                <div className='absolute right-75 top-15'>
                                                    <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                                        <UserMenu close={handleCloseUserMenu}/>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
                                )
                            }
                            {/* <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button> */}
                            <button onClick={()=>setOpenCartSection(true)} className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white'>
                                {/**add to card icons */}
                                <div className='animate-bounce'>
                                    <BsCart4 size={26}/>
                                </div>
                                <div className='font-semibold text-sm'>
                                    {
                                        cartItem[0] ? (
                                            <div>
                                                <p>{totalQty} Items</p>
                                                <p>{DisplayPriceInRupees(totalPrice)}</p>
                                            </div>
                                        ) : (
                                            <p>My Cart</p>
                                        )
                                    }
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
        {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
    </header>
  )
}

export default Header
