import React from 'react';
import "./Aside.sass"
//import MyPageLogo from "./public/images/My Page.svg"
//import Progress from "../Progress/Progress"
import {NavLink} from "react-router-dom";
const Aside = () => {

    const activeStyle = {background: "#333333"}
    const unActiveStyle = {background: "#282828"}

    return (
        <aside className="aside">
        <p className="logo">Libnote</p>
        <div className="menu">
            <NavLink className="menu-item" to="/"> <p className="name-menu-item main-item">Main</p> </NavLink>
            <NavLink className="menu-item" to="/books"> <p className="name-menu-item book-item">Books</p> </NavLink>
            <NavLink className="menu-item" to="/notes"> <p className="name-menu-item note-item">Notes</p> </NavLink>
            <div className="menu-item"> <p className="name-menu-item settings-item">Settings</p> </div>

        </div>

        </aside>
    );
};

export default Aside;