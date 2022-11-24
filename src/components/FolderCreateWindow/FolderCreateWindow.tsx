import React, {useEffect, useRef, useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import "./FolderCreateWindow.sass"
import {AuthContext} from "../../AuthProvider";

const CREATE_FOLDER = gql`
    mutation createFolder($input: FolderInput){
        createFolder(input: $input) {
            id
        }
    }
`

type FolderCreator = {
    setIsShowFolderCreator: any
    refetch: any
}

const FolderCreateWindow: React.FC<FolderCreator> = (props) => {
    const {hideSmokeWindow, showSmokeWindow, userInfo} = React.useContext(AuthContext)
    const [nameCreatedFolder, setNameCreatedFolder] = useState("")

    const [createFolder] = useMutation(CREATE_FOLDER)

    useEffect(() => {
        showSmokeWindow()
    },[])

    const exitFromCreateFolderWindow = () => {
        props.setIsShowFolderCreator(false)
        hideSmokeWindow()
        setNameCreatedFolder("")
    }

    const createFolderEvent = async () => {
        await createFolder(
            {
                variables: {
                    input: {
                        userid: userInfo.id,
                        name: nameCreatedFolder,
                        countofnotes: 0
                    }
                }
            })
        props.setIsShowFolderCreator(false)
        hideSmokeWindow()
        setNameCreatedFolder("")
        props.refetch()
    }

    return (
            <div className="folder-create-window">
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
    );
};

export default FolderCreateWindow;