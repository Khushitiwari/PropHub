import React , { useState } from 'react'
import { profileStyles as s } from '../../assets/dummyStyles'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import { HiCheck, HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiOutlineUser , HiX } from 'react-icons/hi'
import axios from 'axios'
import API_URL from "../../config.js";

const Profile = () => {

  // Get the current user, function to update user, and authentication token
  const { user, setUser, token } = useAuth();


  // State to control whether the profile is in editing mode
  const [isEditing, setIsEditing] = useState(false);
 
  // State to show loading status while updating the profile
  const [loading, setLoading] = useState(false);

  // State to store and display any error message
  const [error, setError] = useState(null);

    // Stores the newly selected profile image
  const [imageFile, setImageFile] = useState(null);

  // Stores the temporary preview URL of the selected image
  const [imagePreview, setImagePreview] = useState(null);

  // Used when the user wants to remove their existing profile picture
  const [removeProfilePic, setRemoveProfilePic] = useState(false);

  // Stores the editable profile information
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleInputChange =  (e) =>{
    const { name , value } = e.target;
    if( name === "phone" ){
        // only 10 digits
        const numbericValue = value.replace(/\D/g,"").slice(0,10);
        setFormData({...formData , [name] : numbericValue });

    }else{
        setFormData({...formData , [name]: value });
    }
  };

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if( file){
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setRemoveProfilePic(false);


      }

  }

  // to update your profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const data = new FormData();

        data.append("name", formData.name);
        data.append("phone", formData.phone);
        data.append("address", formData.address);

        if (imageFile) {
            data.append("profilePic", imageFile);
        }

        if (removeProfilePic) {
            data.append("removeProfilePic", "true");
        }

        const res = await axios.put(
            `${API_URL}/api/user/profiles`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.data.success) {
            const updatedUser = res.data.user;

            // Update React state
            setUser(updatedUser);

            // Update stored user
            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setIsEditing(false);
            setImageFile(null);
            setImagePreview(null);
            setRemoveProfilePic(false);
        }

    } catch (error) {
        console.error("Update profile error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to update profile"
        );
    } finally {
        setLoading(false);
    }
};

  return (
    <div className={s.containerWrapper(user?.role)}>
      { user?.role !== "seller"  && <Navbar /> }
      <div className={s.mainContainer(user?.role)}>
        <header className={s.header}>
            <h1 className={s.pageTitle}>
                Personal Profile
            </h1>
            <p className={s.pageSubtitle}>
                Manage your personal information and account
                settings.

            </p>
            </header>
            <div className={s.card}>
                <div className={s.profileHeader} >
                    <div className={s.avatarSection}>
                        <div className={s.avatarWrapper}>
                            { imagePreview ? (
                                <img  src={imagePreview}  alt="preview"
                                className={s.avatarImage} />
                            ): !removeProfilePic && user?.profilePic  ? (
                                <img src={user.profilePic} alt="pic" className={s.avatarImage} />
                            ): (
                                <span className={s.avatarPlaceholder} >
                                    { user?.name?.[0]?.toUpperCase() || "U" }

                                </span>
                            )}



                        </div>

                        { isEditing && (
                            <>
                            <label className={s.uploadButton}>
                                <input 
                                type="file" 
                                onChange={handleImageChange} 
                                className="hidden" 
                                accept="image/*" // accept only img file
                                /> 
                                <HiOutlineUser size={20} />

                            </label>

                            {(imagePreview || 
                                ( !removeProfilePic && user?.profilePic )
                            ) &&  (
                                <button type="button" onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    setRemoveProfilePic(true);

                                }} className={s.removeButton} title="Remove Profile Picture">
                                 <HiX size={20} />
                                </button>
                            )}
                            </>
                        )}
                    </div>
                    
                    <div>
                        <h2 className={s.userName}>
                            { user?.name}

                        </h2>
                        <span className={s.roleBadge}>

                            {user?.role?.toUpperCase()}
                        </span>
                    </div>
                    
                    

                 {error  &&  <div className={s.errorMessage} > {error} </div> }
                 { isEditing ? (
                    <form onSubmit={handleUpdate} className={s.editForm}>
                        <div>
                           <label className={s.label}>
                            Full Name 
                           </label> 
                           <input type="text" name="name" value={formData.name}
                           onChange={handleInputChange} className={s.input} required />
                           
                        </div>
                        <div>
                            <label className={s.label}>
                                Phone Number

                            </label>
                            <input type="tel" name="phone" value={formData.phone} 
                            onChange={handleInputChange} maxLength="10" pattern="[0-9]{10}"
                            className={s.input} placeholder="Enter your 10 digits phone number" />
                        </div>
                        <div >
                            <label className={s.label}>
                                Address

                            </label>
                            <textarea name="address" value={formData.address} className={s.textarea}
                            placeholder="Enter your full address " 
                            onChange={handleInputChange}> </textarea>

                        </div>
                        <div className={s.formActions}>

                            <button type="submit" disabled={loading} className={s.saveButton} >
                               <HiCheck size={20} />
                               { loading ? "Saving..." : "Save Changes "}
                            </button>
                            <button type="button" onClick={() => {
                                setIsEditing(false);
                                setImagePreview(null);
                                setImageFile(null);
                                setRemoveProfilePic(false);


                            }} className={s.cancelButton}>
                                <HiX size={20} /> Cancel

                            </button>
                        </div>


                    </form>
                 ) : (
                    <div className={s.infoSection} >
                        <div className={s.infoItem }>
                            <div className={s.infoIcon}>
                            <HiOutlineMail size={24} />
                            </div>
                        
                        <div>
                            <div className={s.infoLabel}>
                                Email Address

                            </div>
                            <div className={s.infoValue}>
                                {user?.email}
                            </div>
                        </div>
                        </div>



                        <div className={s.infoItem }>
                            <div className={s.infoIcon}>
                            <HiOutlinePhone size={24} />
                            </div>
                        
                        <div>
                            <div className={s.infoLabel}>
                                Phone Number

                            </div>
                            <div className={s.infoValue}>
                                {user?.phone || "Not Provided"}
                            </div>
                        </div>
                        </div>



                         <div className={s.infoItem }>
                            <div className={s.infoIcon}>
                            <HiOutlineLocationMarker size={24} />
                            </div>
                        
                        <div>
                            <div className={s.infoLabel}>
                               Location / Address

                            </div>
                            <div className={s.infoValue}>
                                {user?.address || "Not Provided"}
                            </div>
                        </div>
                        </div>

                        <div className={s.editButtonWrapper}>
                            <button onClick={() =>  setIsEditing(true)} 
                             className={s.editProfileButton} >
                                Edit Profile Details

                            </button>

                        </div>


                    </div>
                 )}
                
                </div>

            </div>

      </div>
         
    </div>
  )
}

export default Profile