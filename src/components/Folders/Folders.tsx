import React from 'react'
import "./Folders.sass"
import Header from "../Header/Header"
import SectionInfo from "../SectionInfo/SectionInfo"
import {gql, useQuery} from "@apollo/client";
import {AuthContext} from "../../AuthProvider";
import Book from "../Book/Book";
import Folder from "../Folder/Folder";

const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid){
            id
            name
            countofnotes
        }
    }
`

const GET_NOTES_BY_FOLDER = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
`

const Folders = () => {

    const {userInfo} = React.useContext(AuthContext)


    const { loading, data, error, refetch} = useQuery(GET_ALL_FOLDERS, {variables: {userid: userInfo.id}})

    let foldersCount
    data ? foldersCount = data.getAllFolders.length : foldersCount = 0

    const useGetCountNotesByFolder = (folderId: any) => { // TODO: repeated in NewFolders
        const { data} = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderId}})
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }

    return (
        <div>
            <Header/>
            <div className="folders-container">
                <SectionInfo nameSection="Folders" sectionCount={foldersCount}/>

                <div className="folders">
                    {data && data.getAllFolders.map((i: any) =>
                        <Folder folder={i}
                                key={i.id}
                                useGetCountNotesByFolder={useGetCountNotesByFolder}
                        />)
                    }
                </div>
            </div>
        </div>
    );
};

export default Folders