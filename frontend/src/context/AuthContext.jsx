import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from 'axios';
// axios backend and external rest APIs ke saath communicate krregaa
//Axios is a library used to communicate with servers.

import API_URL  from '../config.js'
import { useNavigate } from "react-router";

// Create a global authentication context.
const AuthContext = createContext();

export const AuthProvider =  ( {children }) =>{

   // Store the authenticated user's information.
    const [user, setUser ] = useState(null);

    // Initialize the token from persistent storage.
    const [ token , setToken]  = useState(
        localStorage.getItem("token") || sessionStorage.getItem("token") || null,

    );
    
    // Track whether authentication data is still loading.
    const [loading , setLoading ] = useState(true);
    const navigate = useNavigate();


    useEffect(() =>{

        // Restore the user object from storage if a token exists.
        if ( token ){
            const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
           if(storedUser) {
            setUser(JSON.parse(storedUser));
           }

            
        }


    // Register a global Axios response interceptor to
    // automatically log out blocked users.
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) =>{
                if(
                    error.response &&
                    error.response.status ===403 &&
                    error.response.data.message.includes("blocked")

                
                 
                ){
                    logout();
                }

                return Promise.reject(error);


            }
        )
        // Remove the interceptor when the provider unmounts.
        return () => axios.interceptors.response.eject(interceptor);

   }, [token]);

   // login 
   // Authenticate the user and persist their session.
   const login = async (email , password ) =>{
    try{
     const res = await axios.post(`${API_URL}/api/auth/login` , {email , password});
     const {token , user } = res.data;
     setToken(token);
     setUser(user);

     localStorage.setItem("token" , token);
     localStorage.setItem("user" , JSON.stringify(user));

     return {success: true};

    }
    catch(error){
        return {
            success:false,
            message: error.response?.data?.message || "Login Denied or Failed",

        };

    }
   }

   // register
   const register = async (userData) =>{
    try{
        const res = await axios.post(`${API_URL}/api/auth/register` , userData);
        return {
            success:true,
            message: res.data.message,

        }

    }
    catch(error){
        return {
            success : false ,
            message : error.response?.data?.message || "Registration failed",
        }

    }
   }

   // logout 
   const logout = async ( ) =>{
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");

   }


   // to get the user details
   // Fetch the latest user details from the backend
   const refreshUser = async () =>{
    if( !token) return;
    try{

        const res  = await axios.get(`${API_URL}/api/me` , {
            headers: { Authorization : `Bearer ${token}`},
        });
        if( res.data.success){
            const updateUser = res.data.user;
            setUser(updateUser);

            const storage = localStorage.getItem("token")
            ? localStorage : sessionStorage;

            storage.setItem("user" , JSON.stringify(updateUser));
        }

    }
    catch(error){

        console.log("Failed to  refresh the user: " , error);

    }
   }


    return  <AuthContext.Provider
    value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
    }}
    >
        {children}
    </AuthContext.Provider>
  

 }  

// Custom hook to access authentication context.
export const useAuth = () => useContext(AuthContext);
