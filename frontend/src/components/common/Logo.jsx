import React from 'react'
import { Link } from 'react-router-dom'
import { logoStyles as s } from '../../assets/dummyStyles'
import { HiOutlineLibrary} from "react-icons/hi"


// Destructure known props, provide defaults,
// and collect all remaining props into `props`.
const Logo= ({
  fontSize ='1.5rem',
  iconSize = 24 ,
  showText =true,
  ...props // react passes all props as one object

}) =>{
  return (
    <Link to="/"
     // Forward all additional props (id, onClick, title, etc.)
    {...props }
    className= {`${s.link} ${props.className || ""}`}
    // Apply the default font size while preserving any other inline styles
    style={{ fontSize , ...props.style}}
    >
    <div className={s.iconWrapper}>
    <HiOutlineLibrary size={iconSize}/>

    </div>
    {showText &&  <span className={s.text}> PropHub</span>}
    </Link>
  )
}

export default Logo