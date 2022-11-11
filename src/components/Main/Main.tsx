import React, {useEffect, useRef} from 'react'
import "./Main.sass"
import Header from "../Header/Header"
import Folders from "../Folders/Folders"
import NewBooks from "../NewBooks/NewBooks"
import NewNotes from "../NewNotes/NewNotes"
//@ts-ignore
import {AuthContext} from "../../AuthProvider"
import {useQuery, gql, useMutation} from '@apollo/client'

const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
            id
        }
    }
`

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            content
            dateupdate
        }
    }
`

const Main = () => {

//@ts-ignore
    const {userInfo} = React.useContext(AuthContext)
    //@ts-ignore
    const {onLogout} = React.useContext(AuthContext)





    const getAllNotesQuery = useQuery(GET_ALL_NOTES, {variables: {userid: userInfo.id}})
    const smokeWindow = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if(smokeWindow && smokeWindow.current){
            smokeWindow.current.style.height = `${smokeWindow.current.ownerDocument.body.offsetHeight}px`
        }
    },[smokeWindow, smokeWindow.current])

    useEffect(() => {getAllNotesQuery.refetch()}, [])
    const numOfNotes: any = (getAllNotesQuery.data && getAllNotesQuery.data.getAllNotes) && getAllNotesQuery.data.getAllNotes.length
    console.log(getAllNotesQuery.data)
    //TODO: как типизировать data, data.getAllNotes?




    return (
        <div>
            <Header/>
            <div className="main">
                <button onClick={onLogout}> 555</button>
                <div ref={smokeWindow} className="smoke"> </div>

                <Folders numOfNotes={numOfNotes} smokeWindow={smokeWindow} userInfo={userInfo}/>
                <NewBooks/>
                <NewNotes getAllNotesQuery={getAllNotesQuery}/>
            </div>
        </div>

    );
};

export default Main;