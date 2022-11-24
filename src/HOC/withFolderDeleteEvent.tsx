import React from 'react'
import {gql, useMutation, useQuery} from "@apollo/client";

const DELETE_FOLDER_BY_ID = gql`
    mutation deleteFolderById($id: ID) {
        deleteFolderById(id: $id) {
            id
        }
    }
`
const GET_NOTES_BY_FOLDER = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
` //TODO: FolderId!!! getAllNotes???

const withFolderDeleteEvent= (Component: any) => {
    function WithDelete(props: any) {
        const [deleteFolderById] = useMutation(DELETE_FOLDER_BY_ID)
        const { loading, data, error, refetch} = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderid: "1"}})
        const deleteFolderEvent = async () => {
            await deleteFolderById(
                {
                    variables: {
                        id: props.folder.id
                    }
                })
            data && data.getNotesByFolder.map((i: any) => {

            })
            props.refetchFolders()
        }
        return <Component deleteFolderEvent={deleteFolderEvent} {...props} />
    }
    return WithDelete
}

export default withFolderDeleteEvent