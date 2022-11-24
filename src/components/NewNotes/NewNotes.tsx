import React, {useEffect, useState} from 'react';
import "./NewNotes.sass"
import {gql, useMutation, useQuery} from "@apollo/client"
import {useNavigate} from "react-router-dom"
import Note from "../Note/Note"
import SectionInfo from "../SectionInfo/SectionInfo"

import {getPathToNoteCreate} from "../../Functions"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import useDeleteNoteEvent from "../../Functions/deleteNoteEvent"

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            folderid
            bookid
            content
            dateupdate
        }
    }
`
type NewNotesType = {
    getAllNotesQuery: any
}


const NewNotes: React.FC<NewNotesType> = (props) => {
    const [notesData, setNotesData] = useState<any>([])
    useEffect(() => {
        setNotesData(props.getAllNotesQuery.data)
    }, [props.getAllNotesQuery.data])


    const refetch = () => props.getAllNotesQuery.refetch()

    const navigate = useNavigate()
    const goToNoteCreator = (noteId?: string) => navigate(getPathToNoteCreate(noteId))

    let notesCount
    notesData?.getAllNotes ? notesCount = notesData.getAllNotes.length : notesCount = 0

    return (
        <div className="notes-section">
            <div className="notes-wrapper">
                <SectionInfo nameSection="Notes" sectionCount={notesCount} isLink={true}/>
                <ButtonCreate name="Создать заметку" onClick={() => goToNoteCreator()}/>
            </div>

            <div className="notes">
                {(notesData && notesData.getAllNotes)
                    && notesData.getAllNotes.map((i: any) =>
                        <Note noteId={i.id}
                              key={i.id}
                              folderId={i.folderid}
                              bookId={i.bookid}
                              noteContent={i.content}
                              dateUpdate={i.dateupdate}
                              noteName={i.title}
                              refetchNotes={refetch}
                              goToNoteCreator={goToNoteCreator}
                        />)
                }

            </div>
        </div>
    );
};

export default NewNotes;