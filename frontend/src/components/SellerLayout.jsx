import React from 'react'
import { sellerLayoutStyles as s } from '../assets/dummyStyles'
import { useAuth } from '../../context/AuthContext'
import SellerSidebar from './SellerSidebar'
import { useLocation } from 'react-router'
import DashboardNavbar from  './DashboardNavbar'

const SellerLayout = () => {

    const [isSidebarOpen , setIsSidebarOpen ] = useState(false);
    const { user} = useAuth();
    const location = useLocation();

    // allow access to public route for seller 
    const isPublicDashboardRoute = ['/contact' , 'profile'].include(
        location.pathname,
    );

  return (
    <div className={SellerLayout.container}>
        <SellerSidebar  isOpen={isSidebarOpen} onClose={()=> setIsSidebarOpen(false) } /> 
        
        <div className={s.contentWrapper}>
            <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)  } />
            
            <main className={s.main}>
                { user?.isApproved || }

            </main>

        </div>
    </div>
  )
}

export default SellerLayout