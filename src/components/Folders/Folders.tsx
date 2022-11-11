import React, {useCallback, useEffect, useRef, useState} from 'react';
import Folder from "../Folder/Folder"
import Arrow from "../Arrow/Arrow"
import "./Folders.sass"
import {gql, useMutation, useQuery} from "@apollo/client";
import {NavLink, useNavigate} from "react-router-dom"


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
    smokeWindow: any
    userInfo: any
}


const Folders: React.FC<FoldersType> = (props) => {
    useEffect(() => {refetch()}, [props.numOfNotes])
    const navigate = useNavigate()

    //const authContext = React.useContext(AuthContext)

    console.log({haha: props.userInfo.id})




    const [createFolder] = useMutation(CREATE_FOLDER)
    const { loading, data, error, refetch} = useQuery(GET_ALL_FOLDERS, {variables: {userid: props.userInfo.id}})

    const createFolderWindow = useRef<HTMLDivElement>(null)


    const [position, setPosition] = useState(0)
    const [nameCreatedFolder, setNameCreatedFolder] = useState("")

    const showFolderNotes = (id: string) => {
        navigate(`/folder-notes/${id}`)
    }

    const exitFromCreateFolderWindow = () => {
        if(createFolderWindow && createFolderWindow.current && props.smokeWindow && props.smokeWindow.current){
            createFolderWindow.current.style.display = "none"
            props.smokeWindow.current.style.display = "none"
            setNameCreatedFolder("")
        }
    }

    const showCreateFolderWindow = () => {
        if(createFolderWindow && createFolderWindow.current && props.smokeWindow && props.smokeWindow.current){
            createFolderWindow.current.style.display = "flex"
            props.smokeWindow.current.style.display = "block"
        }
    }
    const createFolderEvent = async () => {
        if(createFolderWindow && createFolderWindow.current && props.smokeWindow && props.smokeWindow.current) {
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
            createFolderWindow.current.style.display = "none"
            props.smokeWindow.current.style.display = "none"
            setNameCreatedFolder("")
            refetch()
        }
    }

    let folderCount
    data ? folderCount = data.getAllFolders.length : folderCount = 0
    const gg = useRef(null)
    const folderSection = useRef(null)
    const folderWidth = 200

    const useGetCountNotesByFolder = (folderid: any) => {
        const { data} = useQuery(GGGG, {variables: {folderid}})
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }

    return (
        <div className="folders-section" ref={folderSection}>
            {/*<div ref={smokeWindow} className="smoke">*/}
                <div ref={createFolderWindow} className="folder-create-window">
                    <div className="exit-icon" onClick={exitFromCreateFolderWindow}> </div>
                    <p className="name-window">Создать папку</p>
                    <p className="name-folder">Название папки</p>
                    <input type="text"
                           className="input-name-folder"
                           placeholder="Введите название папки"
                           value={nameCreatedFolder}
                           onChange={(e) => setNameCreatedFolder(e.target.value)}
                    />
                    <div className="buttons">
                        <button className="button button-exit" onClick={exitFromCreateFolderWindow}>Отмена</button>
                        <button className="button button-create" onClick={createFolderEvent}>Создать</button>
                    </div>

                </div>
            {/*</div>*/}

            <div className="folders-wrapper">
                <div className="folders-info">
                    <NavLink to="folders" className="name-section">Папки</NavLink>
                    <p className="section-count">{`Всего ${folderCount} папок`}</p>
                </div>
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

export default Folders;