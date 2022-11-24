import React from 'react'
import "./Header.sass"
import {AuthContext} from "../../AuthProvider"
import Avatar from "../Avatar/Avatar";

type HeaderType = {
    searchWord?: string
    setSearchWord?: any
    isShow?: boolean //TODO: fix
}

const Header: React.FC<HeaderType> = (props) => {
    const {userInfo} = React.useContext(AuthContext)
    return (
        <header className="header">
            {props.isShow && <input type="text"
                                       className="search"
                                       value={props.searchWord}
                                       onChange={(e) => props.setSearchWord(e.target.value)}/>}
            <p className="user-name">{userInfo.mail}</p>
            <img src={`${process.env.PUBLIC_URL}/images/avatar.png`} alt="" className="user-avatar"/>
            {/*<Avatar/>*/}
        </header>
    );
};

export default Header;