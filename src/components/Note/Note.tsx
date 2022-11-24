import React, {useEffect, useRef, useState} from 'react'
import "./Note.sass"
import * as cn from "classnames"
import withNoteDeleteEvent from "../../HOC/withNoteDeleteEvent"
import withSearchMark from "../../HOC/withSearchMark";
// TODO: type of function!
type NoteProps = {
    noteId: string
    folderId?: string
    bookId?: string
    noteName: string
    noteContent: string
    dateUpdate: string
    deleteNoteEvent?: any
    goToNoteCreator?: any
    searchWord?: string
    getNoteCreatorComponentEvent?: any
    refetchNotes: any
    insertMarkHTML: any
    currentNoteData?: any
}

const Note: React.FC<NoteProps> = (props) => {

    // const dateFormatter = (date: string) => {
    //     const strDate = new Date(+date)
    //     const getCorrectNum = (num: number) => (num < 10) ? `0${num}` : num
    //     const days = strDate.getDate()
    //     const months = strDate.getMonth() + 1
    //     return `${getCorrectNum(days)}.${getCorrectNum(months)}.${strDate.getFullYear()}`
    // }

    const noteNameRef = useRef<HTMLDivElement>(null)
    const noteContentRef = useRef<HTMLDivElement>(null)
    const [isClicked, setIsClicked] = useState(true)


    useEffect(() => {
        if(noteNameRef && noteNameRef.current && noteContentRef && noteContentRef.current){
            noteNameRef.current.innerHTML = props.insertMarkHTML(props.noteName, props.searchWord)
            noteContentRef.current.innerHTML = props.insertMarkHTML(props.noteContent, props.searchWord)
        }

        if(props.noteId && props.currentNoteData && props.currentNoteData.noteId){
            (props.noteId === props.currentNoteData.noteId) ? setIsClicked(false) : setIsClicked(true)
        }

    }, [props])


    const noteClickEvent = () => {
        if(!props.currentNoteData || !props.currentNoteData.noteId ){
            props.goToNoteCreator && props.goToNoteCreator(props.noteId)
            props.getNoteCreatorComponentEvent
            && props.getNoteCreatorComponentEvent(props.noteName, props.noteContent, props.bookId, props.folderId, props.noteId)
        }

        if(props.currentNoteData && props.currentNoteData.noteId !== props.noteId){
            props.goToNoteCreator && props.goToNoteCreator(props.noteId)
            props.getNoteCreatorComponentEvent
            && props.getNoteCreatorComponentEvent(props.noteName, props.noteContent, props.bookId, props.folderId, props.noteId)
        }

        if(props.currentNoteData && props.currentNoteData.noteId && props.currentNoteData.noteId === props.noteId){ // Если выбирается заметка которая является текущей (редактируется)
            props.getNoteCreatorComponentEvent
            && props.getNoteCreatorComponentEvent(props.currentNoteData.noteName,
                props.currentNoteData.noteContent, props.currentNoteData.bookId,
                props.currentNoteData.folderId, props.currentNoteData.noteId)
        }
    }

    return (
        //@ts-ignore
        <div className={cn("note", {"not-clicked": !isClicked})} onClick={noteClickEvent} >
            <div className="delete-note" onClick={(e) => {
                e.stopPropagation();
                props.deleteNoteEvent(props.noteId, props.folderId)
            }}> </div>
            <div className="note-wrapper">
                <div className="note-info">
                    <p ref={noteNameRef} className="note-name"> </p>
                    <p className="note-book"> </p>
                </div>
                <p ref={noteContentRef} className="note-content"> </p>
                <p className="note-time">{props.dateUpdate}</p>
            </div>
        </div>
    )
}

export default withNoteDeleteEvent(withSearchMark(Note))