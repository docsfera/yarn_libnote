import React, {useEffect, useRef, useState} from 'react'
import "./Folder.sass"
import withFolderDeleteEvent from "../../HOC/withFolderDeleteEvent"
import withSearchMark from "../../HOC/withSearchMark"

type FolderType = {
    folder: any //TODO: any
    useGetCountNotesByFolder: any
    deleteFolderEvent: any
    searchWord?: string
    refetchFolders?: any
    showFolderNotes?: any
    insertMarkHTML: any
}

const Folder: React.FC<FolderType> = (props) => {
    const settingsItems = useRef<HTMLDivElement>(null)
    const folderNameRef = useRef<HTMLParagraphElement>(null)
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


    useEffect(() => {
        if(folderNameRef && folderNameRef.current ){
            folderNameRef.current.innerHTML = props.insertMarkHTML(props.folder.name, props.searchWord)
        }

    }, [props.searchWord])


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
                        <div className="settings-item" onClick={props.deleteFolderEvent}>Delete</div>
                    </div>

                </div>
            </div>
            <div className="folder-image" onClick={() => props.showFolderNotes(props.folder.id)}> </div>
            <p ref={folderNameRef} className="folder-name"> </p>
        </div>
    );
};

export default withFolderDeleteEvent(withSearchMark(Folder))