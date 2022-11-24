import React, {useCallback, useEffect, useRef, useState} from 'react';
import Folder from "../Folder/Folder"
import Arrow from "../Arrow/Arrow"
import "./NewFolders.sass"
import {gql, useMutation, useQuery} from "@apollo/client";
import {NavLink, useNavigate} from "react-router-dom"
import FolderCreateWindow from "../FolderCreateWindow/FolderCreateWindow";
import SectionInfo from "../SectionInfo/SectionInfo";
import {AuthContext} from "../../AuthProvider";
import ButtonCreate from "../ButtonCreate/ButtonCreate";


const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid){
            id
            name
            countofnotes
        }
    }
`

const GGGG = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
`

type FoldersType = {
    numOfNotes: any
    userInfo: any
}

const NewFolders: React.FC<FoldersType> = (props) => {
    useEffect(() => {refetch()}, [props.numOfNotes])
    const navigate = useNavigate()
    const [isShowFolderCreator, setIsShowFolderCreator] = useState(false)
    const { loading, data, error, refetch} = useQuery(GET_ALL_FOLDERS, {variables: {userid: props.userInfo.id}})

    const [position, setPosition] = useState(0)

    const showFolderNotes = (id: string) => {
        navigate(`/folder-notes/${id}`)
    }

    let folderCount
    data ? folderCount = data.getAllFolders.length : folderCount = 0
    const gg = useRef(null)
    const folderSection = useRef(null)
    const folderWidth = 200

    const useGetCountNotesByFolder = (folderId: any) => {
        const { data} = useQuery(GGGG, {variables: {folderId}})
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }

    return (
        <div className="folders-section" ref={folderSection}>
            {isShowFolderCreator && <FolderCreateWindow setIsShowFolderCreator={setIsShowFolderCreator} refetch={refetch}/>}

            <div className="folders-wrapper">
                <SectionInfo nameSection="Folders" sectionCount={folderCount} isLink={true}/>
                <ButtonCreate name="Создать папку" onClick={() => setIsShowFolderCreator(true)}/>
            </div>

            <div className="folders">
                <Arrow gg={gg}
                       position={position}
                       elementWidth={folderWidth}
                       setPosition={setPosition}
                       currentSection={folderSection}
                       sectionCount={folderCount}
                       isLeftArrow={true}
                       maxCountToShow={4}
                />

                <div className="folders-container">
                    <div ref={gg} className="itemser">
                        {data
                            ? data.getAllFolders.map( (i: any) =>
                                <Folder folder={i}
                                        key={i.id}
                                        useGetCountNotesByFolder={useGetCountNotesByFolder}
                                        showFolderNotes={showFolderNotes}
                                        refetchFolders={refetch}
                                />) // TODO: any
                            : " "
                        }
                    </div>

                </div>
                <Arrow gg={gg}
                       position={position}
                       elementWidth={folderWidth}
                       setPosition={setPosition}
                       currentSection={folderSection}
                       sectionCount={folderCount}
                       isLeftArrow={false}
                       maxCountToShow={4}
                />
            </div>
        </div>
    );
};

export default NewFolders;