import React, {useState} from 'react'
import { sellerLayoutStyles as s } from '../assets/dummyStyles'
import { useAuth } from "../context/AuthContext";
import SellerSidebar from './SellerSidebar'
import { useLocation } from 'react-router'
import DashboardNavbar from  './DashboardNavbar'
import PendingApproval from '../pages/selller/PendingApproval'
import { Outlet } from 'react-router-dom';

const SellerLayout = () => {

    const [isSidebarOpen , setIsSidebarOpen ] = useState(true);
    const { user} = useAuth();
    const location = useLocation();


    // allow access to public route for seller 
    const isPublicDashboardRoute = ['/contact' , '/profile'].includes(
        location.pathname,
    );

  return (
    <div className={s.container}>
        <SellerSidebar  isOpen={isSidebarOpen} onClose={()=> setIsSidebarOpen(false) } /> 
        
        <div className={s.contentWrapper}>
            <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)  } />
            
            <main className={s.main}>
                { user?.isApproved || isPublicDashboardRoute ? (
                    <Outlet />
                ): (
                    <PendingApproval />
                )}

            </main>

        </div>
    </div>
  )
}

export default SellerLayout