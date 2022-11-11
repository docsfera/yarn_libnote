import React from 'react'
import "./Notes.sass"
import Header from "../Header/Header"
import Note from "../Note/Note";
import InputNoteCreator from "../InputNoteCreator/InputNoteCreator";
import {gql, useQuery} from "@apollo/client";

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            content
            dateupdate
        }
    }`

const Notes = () => {

    //const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: "1"}})

    return (
        <div className="notes">
            <Header/>
            {/*<InputNoteCreator/>*/}
        </div>
    );
};

export default Notes;