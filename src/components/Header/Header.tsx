import React from 'react';
import "./Header.sass"
import {NavLink} from "react-router-dom";
//@ts-ignore
import {AuthContext} from "../../AuthProvider";

const Header = () => {
//@ts-ignore
    const {userInfo} = React.useContext(AuthContext)


    return (
        <header className="header">
            <p className="user-name">{userInfo.mail}</p>
            <img src={`${process.env.PUBLIC_URL}/images/avatar.png`} alt="" className="user-avatar"/>
            {/*<div className="space-between">*/}
            {/*    <div className="menu" >*/}
            {/*        <ul>*/}
            {/*            <li><NavLink to="/">Main</NavLink></li>*/}
            {/*            <li><NavLink to="/books">Books</NavLink></li>*/}
            {/*            <li><NavLink to="/notes">Notes</NavLink></li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}

            {/*    <div className="settings">*/}

            {/*        <ul>*/}
            {/*            <li className="main"><a href="">settings</a></li>*/}
            {/*            <li className="q"><a href="">fjdjfsdkf</a></li>*/}
            {/*            <li className="q"><a href="">fjdjfsdkf</a></li>*/}
            {/*            <li className="q"><a href="">fjdjfsdkf</a></li>*/}
            {/*        </ul>*/}

            {/*    </div>*/}
            {/*</div>*/}



        </header>
    );
};

export default Header;