import React, {useState} from 'react'
import "./Notes.sass"
import Header from "../Header/Header"
import {gql, useQuery} from "@apollo/client"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../AuthProvider"
import SectionInfo from "../SectionInfo/SectionInfo"

import {getPathToNoteCreate} from "../../Functions"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import NotesComponent from "../NotesComponent/NotesComponent"

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


    const {data, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

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
                    <NotesComponent
                        searchWord={searchWord}
                        condition={condition}
                        goToNoteCreator={goToNoteCreator}
                    />
                </div>
            </div>
        </div>
    );
};

export default Notes