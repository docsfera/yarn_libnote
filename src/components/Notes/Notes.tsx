import React from 'react'
import "./Notes.sass"
import Header from "../Header/Header"
import Note from "../Note/Note";
import InputNoteCreator from "../InputNoteCreator/InputNoteCreator";
import {gql, useQuery} from "@apollo/client";
import {AuthContext} from "../../AuthProvider";
import SectionInfo from "../SectionInfo/SectionInfo";

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            content
            dateupdate
        }
    }`

const Notes = () => {

    const {userInfo} = React.useContext(AuthContext) // TODO: во всех вкладках7



    const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

    let notesCount
    data ? notesCount = data.getAllNotes.length : notesCount = 0

    return (
        <div>
            <Header/>
            <div className="notes-container">
                <SectionInfo nameSection="Notes" sectionCount={notesCount}/>

                <div className="books">
                </div>
            </div>
        </div>
    );
};

export default Notes;