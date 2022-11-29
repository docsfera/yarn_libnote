import React, {useEffect} from 'react'
import {AuthContext} from "../../AuthProvider"
import {gql, useQuery} from "@apollo/client"
import Note from "../Note/Note"
import "./NotesComponent.sass"

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
// goToNoteCreator and getNoteCreatorComponentEvent????
type NotesComponentType = {
    data?: any
    goToNoteCreator?: any
    getNoteCreatorComponentEvent?: any
    searchWord?: string
    condition?: any
    isShowNoteCreator?: any
    currentNoteData?: any
}

const NotesComponent: React.FC<NotesComponentType> = (props) => {
    const {userInfo} = React.useContext(AuthContext)
    const {data, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

    useEffect(() => {refetch()},[props?.isShowNoteCreator])

    const getData = () => {
        let currentData = []
        if(props.data){
            currentData = props.data
        }else if(!props.data && data?.getAllNotes){
            currentData = data?.getAllNotes
        }else{
            currentData = []
        }

        if(props.condition){
            return currentData.filter((i: any) => props.condition(i, props.searchWord))
        }else{
            return currentData
        }
    }

    console.log({data: getData()})

    return (
        <div className="notes">
            {getData().map((i: any) =>
                <Note noteId={i.id}
                      key={i.id}
                      folderId={i.folderid}
                      bookId={i.bookid}
                      noteContent={i.content}
                      dateUpdate={i.dateupdate}
                      noteName={i.title}
                      refetchNotes={refetch}
                      goToNoteCreator={props.goToNoteCreator}
                      getNoteCreatorComponentEvent={props.getNoteCreatorComponentEvent}
                      searchWord={props.searchWord}
                      currentNoteData={props.currentNoteData}
                />)
            }
        </div>
    );
};
export default NotesComponent;