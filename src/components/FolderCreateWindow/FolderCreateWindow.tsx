import React, {useRef, useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import "./FolderCreateWindow.sass"

const CREATE_FOLDER = gql`
    mutation createFolder($input: FolderInput){
        createFolder(input: $input) {
            id
        }
    }
`

type FolderCreator = {
    exitFromCreateFolderWindow: any
    createFolderEvent: any
    setNameCreatedFolder: any
    nameCreatedFolder: string
}

const FolderCreateWindow: React.FC<FolderCreator> = (props) => {

    //const [nameCreatedFolder, setNameCreatedFolder] = useState("")

    return (
            <div className="folder-create-window">
                <div className="exit-icon" onClick={props.exitFromCreateFolderWindow}> </div>
                <p className="name-window">Создать папку</p>
                <p className="name-folder">Название папки</p>
                <input type="text"
                       className="input-name-folder"
                       placeholder="Введите название папки"
                       value={props.nameCreatedFolder}
                       onChange={(e) => props.setNameCreatedFolder(e.target.value)}
                />
                <div className="buttons">
                    <button className="button button-exit" onClick={props.exitFromCreateFolderWindow}>Отмена</button>
                    <button className="button button-create" onClick={props.createFolderEvent}>Создать</button>
                </div>

            </div>
    );
};

export default FolderCreateWindow;