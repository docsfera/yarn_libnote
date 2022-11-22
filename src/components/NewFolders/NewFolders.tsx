import React, {useCallback, useEffect, useRef, useState} from 'react';
import Folder from "../Folder/Folder"
import Arrow from "../Arrow/Arrow"
import "./NewFolders.sass"
import {gql, useMutation, useQuery} from "@apollo/client";
import {NavLink, useNavigate} from "react-router-dom"
import FolderCreateWindow from "../FolderCreateWindow/FolderCreateWindow";
import SectionInfo from "../SectionInfo/SectionInfo";
import {AuthContext} from "../../AuthProvider";


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

const CREATE_FOLDER = gql`
    mutation createFolder($input: FolderInput){
        createFolder(input: $input) {
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
    const {hideSmokeWindow, showSmokeWindow} = React.useContext(AuthContext)

    const [createFolder] = useMutation(CREATE_FOLDER)
    const [isShowFolderCreator, setIsShowFolderCreator] = useState(false)
    const changeIsShowFolderCreator = () => setIsShowFolderCreator(!isShowFolderCreator)
    const { loading, data, error, refetch} = useQuery(GET_ALL_FOLDERS, {variables: {userid: props.userInfo.id}})

    const [position, setPosition] = useState(0)
    const [nameCreatedFolder, setNameCreatedFolder] = useState("")

    const showFolderNotes = (id: string) => {
        navigate(`/folder-notes/${id}`)
    }

    const exitFromCreateFolderWindow = () => {
        setIsShowFolderCreator(false)
        hideSmokeWindow()
        setNameCreatedFolder("")
    }

    const showCreateFolderWindow = () => {
            changeIsShowFolderCreator()
            showSmokeWindow()
    }
    const createFolderEvent = async () => {
        //if(createFolderWindow && createFolderWindow.current && props.smokeWindow && props.smokeWindow.current) {
            await createFolder(
                {
                    variables: {
                        input: {
                            userid: props.userInfo.id,
                            name: nameCreatedFolder,
                            countofnotes: 0
                        }
                    }
                })
            //createFolderWindow.current.style.display = "none"
            setIsShowFolderCreator(false)
            //props.smokeWindow.current.style.display = "none"
            hideSmokeWindow()
            setNameCreatedFolder("")
            refetch()
        //}
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
            {isShowFolderCreator && <FolderCreateWindow exitFromCreateFolderWindow={exitFromCreateFolderWindow}
                                                        createFolderEvent={createFolderEvent}
                                                        nameCreatedFolder={nameCreatedFolder}
                                                        setNameCreatedFolder={setNameCreatedFolder}/>}

            <div className="folders-wrapper">
                <SectionInfo nameSection="Folders" sectionCount={folderCount} isLink={true}/>
                <div className="create-folder" onClick={showCreateFolderWindow}>
                    Создать папку
                </div>
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