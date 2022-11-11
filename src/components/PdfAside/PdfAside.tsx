import React, {useState} from 'react';
import "./PdfAside.sass"
import cn from 'classnames/dedupe'
import {gql, useQuery} from "@apollo/client";
import Note from "../Note/Note";

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            folderid
            bookid
            content
            dateupdate
        }
    }
`

type PdfAsideType = {
    isShowAside: boolean
    isShowNoteCreator: boolean
    isShowSmokeWindow: boolean
    setIsShowNoteCreator: any
    setCurrentNoteData: any
    setIsShowSmokeWindow: any
    setIsShowAside: any

    currentNoteData: any
    userId: string
}

const PdfAside: React.FC<PdfAsideType> = (props) => {

    const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: props.userId}})
    const [searchWord, setSearchWord] = useState("")

    const condition = (note: any, searchWord: string) => {
        if(note.title.toLowerCase().includes(searchWord.toLowerCase())
            || note.content.toLowerCase().includes(searchWord.toLowerCase())){
            return note
        }
    }

    const getNoteCreatorComponentEvent = (noteName: string, noteContent: string, bookId: string, folderId: string, noteId: string) => {
        !props.isShowNoteCreator && props.setIsShowNoteCreator(!props.isShowNoteCreator)
        props.setCurrentNoteData({name: noteName, content: noteContent, bookId, folderId, noteId})
        !props.isShowSmokeWindow && props.setIsShowSmokeWindow(!props.isShowSmokeWindow)
        props.setIsShowAside(!props.isShowAside)
    }


    return (
        <aside className={cn("book-aside", {"book-aside-active": props.isShowAside})} >
            <input type="text" className="book-aside-input" value={searchWord} onChange={(e) => setSearchWord(e.target.value)}/>

            {
                data && data.getAllNotes.filter((i: any) => condition(i, searchWord)).map((i: any) =>
                    <Note noteId={i.id}
                          folderId={i.folderid}
                          bookId={i.bookid}
                          noteName={i.title}
                          noteContent={i.content}
                          dateUpdate={i.dateupdate}
                          searchWord={searchWord}
                          getNoteCreatorComponentEvent={getNoteCreatorComponentEvent}
                          currentNoteData={props.currentNoteData}/>
                )
            }

        </aside>
    );
};

export default PdfAside;