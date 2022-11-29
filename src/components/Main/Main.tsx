import React, {useEffect, useRef, useState} from 'react'
import "./Main.sass"
import Header from "../Header/Header"
import NewFolders from "../NewFolders/NewFolders"
import NewBooks from "../NewBooks/NewBooks"
import NewNotes from "../NewNotes/NewNotes"
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
            folderid
            bookid
            dateupdate
        }
    }
`

const Main = () => {
    const {userInfo} = React.useContext(AuthContext)
    const getAllNotesQuery = useQuery(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

    useEffect(() => {
        getAllNotesQuery.refetch()
    }, [])
    const numOfNotes: any = (getAllNotesQuery.data && getAllNotesQuery.data.getAllNotes) && getAllNotesQuery.data.getAllNotes.length

    //TODO: как типизировать data, data.getAllNotes?

    return (
        <div>
            <Header/>
            <div className="main">
                <NewFolders numOfNotes={numOfNotes} userInfo={userInfo}/>
                <NewBooks/>
                <NewNotes getAllNotesQuery={getAllNotesQuery}/>
            </div>
        </div>
    )
}
export default Main