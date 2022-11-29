import React, {useState} from 'react'
import "./PdfAside.sass"
import cn from 'classnames/dedupe'
import {gql, useQuery} from "@apollo/client"
import NotesComponent from "../NotesComponent/NotesComponent"
import ButtonCreate from "../ButtonCreate/ButtonCreate";

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

    const [searchWord, setSearchWord] = useState("")

    const condition = (note: any, searchWord: string) => {
        if(note.title.toLowerCase().includes(searchWord.toLowerCase())
            || note.content.toLowerCase().includes(searchWord.toLowerCase())){
            return note
        }
    }

    const getNoteCreatorComponentEvent = (
        noteName: string, noteContent: string, bookId: string | null, folderId: string | null, noteId: string | null) => {

        !props.isShowNoteCreator && props.setIsShowNoteCreator(!props.isShowNoteCreator)
        console.log('here')
        props.setCurrentNoteData({name: noteName, content: noteContent, bookId, folderId, noteId})
        !props.isShowSmokeWindow && props.setIsShowSmokeWindow(!props.isShowSmokeWindow)
        props.setIsShowAside(!props.isShowAside)
    }

    const noteCreateEvent = () => {
        getNoteCreatorComponentEvent("Untitled", "", null, null, null)
    }


    return (
        <aside className={cn("book-aside", {"book-aside-active": props.isShowAside})} >
            <div className="book-aside-settings">
                <ButtonCreate name="Новая заметка" onClick={noteCreateEvent} />
                <input type="text" className="book-aside-input" value={searchWord} onChange={(e) => setSearchWord(e.target.value)}/>
            </div>


            <NotesComponent
                getNoteCreatorComponentEvent={getNoteCreatorComponentEvent}
                searchWord={searchWord}
                currentNoteData={props.currentNoteData}
                condition={condition}
                isShowNoteCreator={props.isShowNoteCreator}
            />
        </aside>
    );
};

export default PdfAside;