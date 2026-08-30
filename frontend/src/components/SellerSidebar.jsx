import React from 'react'
import { sellerSidebarStyles as s } from '../assets/dummyStyles';
import Logo from './common/Logo';
import { HiOutlineViewGrid , HiOutlineViewList , HiOutlineChartBar, HiOutlineUser , HiOutlineSupport, HiOutlineLogout} from 'react-icons/hi';
import { NavLink } from 'react-router';
import { useAuth } from "../context/AuthContext";


// const SellerSidebar = ({ isOpen , onClose}) => {
//  const { logout , user } = useAuth();

//  const navItems = [
//     { name: "Dashboard" , icon:HiOutlineViewGrid, path:"/dashboard"},
//     {
//         name: "My Listings",
//         icon: HiOutlineViewList,
//         path: "/mt-properties",

//     },
//     {name:"Leads", icon:  HiOutlineChartBar, path:"/inquiries"},
//     {name:"Message", icon: HiOutlineViewGrid, path:"/chat-messages"},
//     {name:"Profile", icon:HiOutlineUser, path:"/profile"},
//     {name:"Support", icon:HiOutlineSupport, path:"/contact" },



//  ]

//   return (
//     <div className={`${s.backdrop} ${isOpen? s.backdropVisible : s.backdropHidden }`}
//     onClick={onClose}>
//       <aside className={`${s.sidebar} ${isOpen ? s.sidebarOpen : s.sidebarClosed}`}>
       

//         <div className={s.logoContainer}>
//           <Logo fontSize="1.25rem" iconSize={20}/>

//         </div>
//         <nav className={s.nav}>
//           {navItems.map((item) => (
//             <NavLink key={item.name} to={item.path} onClick={onClose}
//             className={({isActive}) =>`${s.navLink} ${isActive ? s.navLinkActive : s.navLinkInactive}` }>
//                 <item.icon size={20} />
//                 {item.name} 

//             </NavLink>
//           ))}

//         </nav>
//         <div className={s.logoutContainer}>
//           <button onClick={
//             logout
//           } className={s.logoutButton}>
//             <HiOutlineLogout size={20} />
//             Logout

//           </button>

//         </div>
//       </aside>
    
//     </div>
//   )
// }


const SellerSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

   const navItems = [
    { name: "Dashboard" , icon:HiOutlineViewGrid, path:"/dashboard"},
    {
        name: "My Listings",
        icon: HiOutlineViewList,
        path: "/mt-properties",

    },
    {name:"Leads", icon:  HiOutlineChartBar, path:"/inquiries"},
    {name:"Message", icon: HiOutlineViewGrid, path:"/chat-messages"},
    {name:"Profile", icon:HiOutlineUser, path:"/profile"},
    {name:"Support", icon:HiOutlineSupport, path:"/contact" },



 ];


  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`${s.backdrop} ${
          isOpen ? s.backdropVisible : s.backdropHidden
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`${s.sidebar} ${
          isOpen ? s.sidebarOpen : s.sidebarClosed
        }`}
      >
        <div className={s.logoContainer}>
          <Logo fontSize="1.25rem" iconSize={20} />
        </div>

        <nav className={s.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${s.navLink} ${
                  isActive
                    ? s.navLinkActive
                    : s.navLinkInactive
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className={s.logoutContainer}>
          <button
            onClick={logout}
            className={s.logoutButton}
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
export default SellerSidebar