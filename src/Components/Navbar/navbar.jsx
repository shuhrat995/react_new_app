import { NavLink } from "react-router-dom";
import { TiHeartFullOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { FcSearch } from "react-icons/fc";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/">
        <FcSearch />
        Search
      </NavLink>
      <NavLink to="/Favorites">
        <TiHeartFullOutline />
        Favorites
      </NavLink>
      <NavLink to="/Settings">
        <IoSettingsOutline />
        Settings
      </NavLink>
    </nav>
  );
}
