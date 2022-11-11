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

const FolderCreateWindow = () => {
    const [createFolder] = useMutation(CREATE_FOLDER)
    const smokeWindow = useRef<HTMLDivElement>(null)
    const createFolderWindow = useRef<HTMLDivElement>(null)
    const [folderName, setFolderName] = useState("")

    const exitFromCreateFolderWindow = () => {
        if(createFolderWindow && createFolderWindow.current && smokeWindow && smokeWindow.current){
            createFolderWindow.current.style.display = "none"
            smokeWindow.current.style.display = "none"
        }
    }
    const createFolderEvent = async () => {
        /*TODO: нужно как-то растянуть на весь экран,  возможно передавать ширину Main в пропсах
        также нужно запретить выполнять какие-либо операции во время затемнения или выполнять
        закрытие окна при клике вне области окна (через ссылку родителя?)
        запретить скроллить???7
         */
        console.log(createFolderWindow)

        if(createFolderWindow && createFolderWindow.current && smokeWindow && smokeWindow.current){
            console.log(smokeWindow.current.ownerDocument.body.offsetHeight, smokeWindow.current.style.height)
            smokeWindow.current.style.height = `${smokeWindow.current.ownerDocument.body.offsetHeight}`
            createFolderWindow.current.style.display = "flex"
            console.log(smokeWindow.current.ownerDocument.body.offsetHeight, smokeWindow.current.style.height)
            smokeWindow.current.style.display = "block"
        }

        // await createFolder(
        //     {
        //         variables: {
        //             input: {
        //                 userid: "1",
        //                 name: "name",
        //                 countofnotes: 0
        //             }
        //         }
        //     })
        // refetch()
    }

    return (
        <div ref={smokeWindow} className="smoke">
            <div ref={createFolderWindow} className="folder-create-window">
                <div className="exit-icon" onClick={exitFromCreateFolderWindow}> </div>
                <p className="name-window">Создать папку</p>
                <p className="name-folder">Название папки</p>
                <input type="text" className="input-name-folder" placeholder=" pla"/>
                <div className="buttons">
                    <button className="button button-exit" onClick={exitFromCreateFolderWindow}>Отмена</button>
                    <button className="button button-create">Создать</button>
                </div>

            </div>
        </div>
    );
};

export default FolderCreateWindow;