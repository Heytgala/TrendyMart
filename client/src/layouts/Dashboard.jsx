import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../index.css'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  console.log("user dashboard",user)
  return (
    <section className="dashboard-container">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <UserMenu />
      </aside>

      {/* Right Content */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </section>
    /*
    <section className='bg-white'>
        <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr] h-screen'>
                
                <div className='py-4 sticky top-24 max-h-screen overflow-y-auto hidden lg:block border-r'>
                    <UserMenu/>
                </div>


          
                <div className='bg-white min-h-screen lg:ml-[250px] mt-0'>
                    <Outlet/>
                </div>
        </div>
    </section>
    */
  )
}

export default Dashboard