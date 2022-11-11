import React, {useEffect, useState} from 'react';
import "./FolderNotes.sass"
import {useQuery, gql, useMutation} from "@apollo/client"
import {useNavigate, useParams} from "react-router-dom"
import Note from "../Note/Note"

//TODO: dont repeat yourself
const GET_NOTES_BY_FOLDER = gql` 
    query getNotesByFolder($folderid: ID){
        getNotesByFolder(folderid: $folderid) {
            id
            title
            
            content
            dateupdate
        }
    }
`

const GET_FOLDER_BY_ID = gql` 
    query getFolderById($id: ID){
        getFolderById(id: $id) {
            name
            countofnotes
        }
    }
`

//updateFolderName(folderid: ID, name: String): Folder

const UPDATE_FOLDER_NAME = gql` 
    mutation updateFolderName($id: ID, $name: String){
        updateFolderName(id: $id, name: $name) {
            name
            id
        }
    }
`


const FolderNotes = () => {
    const {id} = useParams()
    const [updateFolderName] = useMutation(UPDATE_FOLDER_NAME)
    const {data, refetch} = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderid: id}})
    const currentFolder = useQuery(GET_FOLDER_BY_ID, {variables: {id}})
    const currentFolderData = currentFolder.data
    const currentFolderRefetch = currentFolder.refetch

    useEffect(() => {
        if(currentFolderData && currentFolderData.getFolderById){
            setFolderName(currentFolderData.getFolderById.name)
        }
        refetch()
    }, [currentFolder])

    const [folderName, setFolderName] = useState("")


    const navigate = useNavigate()



    const goToNoteCreator = () => {
        navigate(`/note-creator`, {state: {folderId: id}})
    }
    const renameFolderEvent = async (name: string) => { //TODO: а если имя не изменилось?
        setFolderName(name)
        await updateFolderName(
            {
                variables: {
                    id, name
                }
            })
        currentFolderRefetch()
    }

    return (
        <div className="folder-notes">
            <div className="folder-notes-wrapper">
                <div className="folder-info">
                    <div className="folder-name"
                         contentEditable="true"
                         onBlur={(e) => renameFolderEvent(e.target.innerText)}>{folderName}</div>

                    <div className="count-notes">{`Всего заметок ${data && data.getNotesByFolder.length}`}</div>
                </div>
                <div className="create-note" onClick={() => goToNoteCreator()}>
                    Создать заметку
                </div>
            </div>


            {data && data.getNotesByFolder.map((i: any) =>
                <Note noteId={i.id}
                      folderId={id}
                      noteName={i.title}
                      noteContent={i.content}
                      dateUpdate={i.dateupdate}/>)
            }
        </div>
    )
};

export default FolderNotes;