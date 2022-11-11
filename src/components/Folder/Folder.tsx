import React, {useEffect, useRef, useState} from 'react'
import "./Folder.sass"
import {gql, useMutation, useQuery} from "@apollo/client";

type folderType = {
    folder: any //TODO: any
    useGetCountNotesByFolder: any
    refetchFolders: any
    showFolderNotes: any
}

const GET_NOTES_BY_FOLDER = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
` //TODO: FolderId!!! getAllNotes???

const DELETE_FOLDER_BY_ID = gql`
    mutation deleteFolderById($id: ID) {
        deleteFolderById(id: $id) {
            id
        }
    }


`

const Folder: React.FC<folderType> = (props) => {

//нельзя убирать, еще нужен будет для перехода к папке
// const { loading, data, error} = useQuery(GGGG, {variables: {folderid: props.folder.id}})

    console.log({"Folder": props})

    const settingsItems = useRef<HTMLDivElement>(null)

    const { loading, data, error, refetch} = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderid: "1"}})
    const [deleteFolderById] = useMutation(DELETE_FOLDER_BY_ID)

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


    const showSettingsItems = () => {
        if(settingsItems && settingsItems.current) {
            if(settingsItems.current.style.cssText == ""){
                settingsItems.current.style.display = "block"
            }else{
                if(settingsItems.current.style.display !== "none"){
                    settingsItems.current.style.display = "none"
                }else{
                    settingsItems.current.style.display = "block"
                }
            }
        }
    }

    return (
        <div className="folder">
            <div className="folder-info">
                <div className="folder-count">{props.folder.countofnotes}</div>
                <div className="folder-settings">
                    <div className="ovals" onClick={showSettingsItems}>
                        <div className="oval"> </div>
                        <div className="oval"> </div>
                        <div className="oval"> </div>
                    </div>
                    <div ref={settingsItems} className="settings-items">
                        {/*<div className="settings-item">Rename</div>*/}
                        <div className="settings-item" onClick={deleteFolderEvent}>Delete</div>
                    </div>

                </div>
            </div>
            <div className="folder-image" onClick={() => props.showFolderNotes(props.folder.id)}> </div>
            <p className="folder-name">{props.folder.name}</p>
        </div>
    );
};

export default Folder;