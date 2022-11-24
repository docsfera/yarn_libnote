import React, {ReactElement} from 'react'
import {gql, useMutation, useQuery} from "@apollo/client"

const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
            id
        }
    }
`
const UPDATE_FOLDER_COUNT_NOTES = gql`
    mutation updateFolderCountNotes($folderid: ID, $mode: String){
        updateFolderCountNotes(folderid: $folderid, mode: $mode) {
            id
        }
    }
`

const withNoteDeleteEvent = (Component: any) => {
    function WithDelete(props: any) {
        const {folderId, noteId, refetchNotes} = props
        const [deleteNote] = useMutation(DELETE_NOTE_BY_ID)
        const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)
        const deleteNoteEvent = async () => {
            await deleteNote({variables: {noteid: noteId}})
            folderId && await updateFolderCountNotes({variables: {folderid: folderId, mode: "-"}})
            await refetchNotes()
        }
        return <Component deleteNoteEvent={deleteNoteEvent} {...props} />
    }
    return WithDelete
}

export default withNoteDeleteEvent