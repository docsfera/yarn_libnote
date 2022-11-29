import React, {useEffect, useRef, useState} from 'react'
import "./NewBooks.sass"
import {NavLink, useNavigate} from "react-router-dom"
import {gql, useQuery} from "@apollo/client";
import Book from "../Book/Book";
import Arrow from "../Arrow/Arrow";
//@ts-ignore
import {AuthContext} from "../../AuthProvider";
import SectionInfo from "../SectionInfo/SectionInfo";

const GET_ALL_BOOKS = gql`
    query getAllBooks($userid: ID){
        getAllBooks(userid: $userid){
            id
            name
            utfname
            image
        }
    }
`

const NewBooks = () => {
    const navigate = useNavigate()
    //@ts-ignore
    const {userInfo} = React.useContext(AuthContext)
    const {data} = useQuery(GET_ALL_BOOKS, {variables:{userid: userInfo.id}})

    let [position, setPosition] = useState(0)
    const gg = useRef(null)
    const bookSection = useRef(null)
    const bookWidth = 155
    let bookCount
    data ? bookCount = data.getAllBooks.length : bookCount = 0

    return (
        <div className="folders-section" ref={bookSection}>
            <SectionInfo nameSection="Books" sectionCount={bookCount} isLink={true}/>
            {/*<NavLink to="books" className="name-section">Книги</NavLink>*/}
            {/*<p className="section-count">{`Всего ${bookCount} книг`}</p>*/}
            <div className="folders">
                    <Arrow gg={gg}
                    position={position}
                    elementWidth={bookWidth}
                    setPosition={setPosition}
                    currentSection={bookSection}
                    sectionCount={bookCount}
                    isLeftArrow={true}
                    maxCountToShow={1}
                    />

                <div className="folders-container">
                    <div ref={gg} className="itemser">
                        {data && data.getAllBooks.map((i:any) =>
                            i.image
                                ? <img src={`/files/${userInfo.id}/${i.image}`}
                                 alt=""
                                 key={i.id}
                                 className="image"
                                 onClick={()=>navigate(`/pdf-viewer/${userInfo.id}`,
                                     {state: {book: i}})}/>
                                : <img src="/images/non-found-book.png" /// todo: another component
                                       alt=""
                                       key={i.id}
                                       className="image"
                                       onClick={()=>navigate(`/pdf-viewer/${userInfo.id}`,
                                           {state: {book: i}})}/> //TODO: another onclick
                        )}
                    </div>
                </div>
                <Arrow gg={gg}
                       position={position}
                       elementWidth={bookWidth}
                       setPosition={setPosition}
                       currentSection={bookSection}
                       sectionCount={bookCount}
                       isLeftArrow={false}
                       maxCountToShow={1}
                />
            </div>
        </div>
    );

};

export default NewBooks;