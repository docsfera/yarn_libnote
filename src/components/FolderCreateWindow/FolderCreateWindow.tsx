import React, {useEffect, useRef, useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import "./FolderCreateWindow.sass"
import {AuthContext} from "../../AuthProvider";
import ButtonQuery from "../ButtonQuery/ButtonQuery";

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
    const [isCreateLoading, setIsCreateLoading] = useState(false)

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
        setIsCreateLoading(true)
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
        setIsCreateLoading(false)
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
                    <ButtonQuery type="Exit" width={150} name="Отмена" callBack={exitFromCreateFolderWindow}/>
                    <ButtonQuery
                        type="Create"
                        width={150}
                        name="Создать"
                        callBack={createFolderEvent}
                        isLoading={isCreateLoading}
                    />
                </div>

            </div>
    );
};

export default FolderCreateWindow;