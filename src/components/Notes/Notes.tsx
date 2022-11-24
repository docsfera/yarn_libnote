import React, {useEffect, useState} from 'react'
import "./Notes.sass"
import Header from "../Header/Header"
import Note from "../Note/Note";
import InputNoteCreator from "../InputNoteCreator/InputNoteCreator";
import {gql, useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../AuthProvider";
import SectionInfo from "../SectionInfo/SectionInfo";
import Folder from "../Folder/Folder";

import {getPathToNoteCreate} from "../../Functions"
//import deleteNoteEvent from "../../Functions/deleteNoteEvent"
import ButtonCreate from "../ButtonCreate/ButtonCreate";

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            content
            title
            dateupdate
        }
    }`

const Notes = () => {
    const navigate = useNavigate()
    const goToNoteCreator = (noteId?: string) => navigate(getPathToNoteCreate(noteId))

    const {userInfo} = React.useContext(AuthContext) // TODO: во всех вкладках7
    const [searchWord, setSearchWord] = useState("")


    const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

    useEffect(() => {refetch()}, [])

    let notesCount
    data?.getAllNotes ? notesCount = data.getAllNotes.length : notesCount = 0

    const condition = (note: any, searchWord: string) => {
        if(note.title.toLowerCase().includes(searchWord.toLowerCase())
            || note.content.toLowerCase().includes(searchWord.toLowerCase())){
            return note
        }
    }

    return (
        <div>
            <Header setSearchWord={setSearchWord} searchWord={searchWord} isShow={true}/>
            <div className="notes-container">
                <div className="notes-wrapper">
                    <SectionInfo nameSection="Notes" sectionCount={notesCount}/>
                    <ButtonCreate name="Создать заметку" onClick={() => goToNoteCreator()}/>
                </div>


                <div className="notes">
                    {data && data.getAllNotes.filter((i: any) => condition(i, searchWord)).map((i: any) =>
                        <Note noteId={i.id}
                              noteName={i.title}
                              noteContent={i.content}
                              dateUpdate={i.dateupdate}
                              searchWord={searchWord}
                              goToNoteCreator={goToNoteCreator}
                              refetchNotes={refetch}
                        />)

                    }
                </div>
            </div>
        </div>
    );
};

export default Notes;