import React from 'react'
import {gql, useMutation} from "@apollo/client"

const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
            id
        }
    }
`

const withNoteDeleteEvent = (Component: any) => {
    function WithDelete(props: any) {
        const {noteId, refetchNotes} = props
        const [deleteNote] = useMutation(DELETE_NOTE_BY_ID)
        const deleteNoteEvent = async () => {
            await deleteNote({variables: {noteid: noteId}})
            await refetchNotes()
        }
        return <Component deleteNoteEvent={deleteNoteEvent} {...props} />
    }
    return WithDelete
}

export default withNoteDeleteEvent