import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate, replace } from 'react-router-dom';

const ProtectedRoute = ({alloweRoles}) => {

    const { user, loading } = useAuth();
    if( loading ){
        return(
            <div className='flex justify-center p-25'>
                <div className="loader">

                </div>

            </div>
        )
    }

   const isGuestAllowed =  allowedRoles?.includes( undefined );
   if( !user && ! isGuestAllowed ){ 
    return <Navigate to="/login" replace />

   }

   if( user && allowedRoles && !alloweRoles.includes(user.role) ){
     if( user.role === "admin" )
        return <Naviagte to="/admin-dashboard" replace />

     if( user.role === "seller") return <Navigate to='/dashboard' replace />
     return <Navigate to='/' replace />
   }
  return  <Outlet />
}

// public route
const PublicRoute = () => {
    const { user , loading } = userAuth();

    if( loading ){
        return (
            <div className="flex justify-center p-24"> 
             <div className="loader" >

             </div>

            </div>
        )
    }

    if( user ){
        if( user.role === "admin" )
            return <Navigate to="/admin-dashboard" replace />;

        if( user.role === "seller") return <Navigate to="/dashboard" replace />;
        return <Navigate to="/" />
    }
}

export default  { ProtectedRoute , PublicRoute };