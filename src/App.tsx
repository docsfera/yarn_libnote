import React, {useEffect, useRef} from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Aside from "./components/Aside/Aside"
import AuthWrapper from "./components/AuthWrapper/AuthWrapper"
import Main from "./components/Main/Main"
import Books from "./components/Books/Books"
import Notes from "./components/Notes/Notes"
import Folders from "./components/Folders/Folders"
import NoteCreator from "./components/NoteCreator/NoteCreator"
import FolderNotes from "./components/FolderNotes/FolderNotes"
import PdfViewer from "./components/PdfViewer/PdfViewer"
import AuthProvider, {AuthContext} from "./AuthProvider"
import BookSettings from "./components/BookSettings/BookSettings"
import UserSettings from "./components/UserSettings/UserSettings"

function App() {
  //console.log(localStorage.getItem('token'))
    return (
        <AuthProvider>
            <AuthContext.Consumer>
                {value => value.userInfo.id
                    ?
                    <div className="App">
                        <Aside/>
                        <Routes>
                            <Route path='/' element={<Main/>}/>
                            <Route path='/books' element={<Books userInfo={value.userInfo}/>}/>
                            <Route path='/notes' element={<Notes/>}/>
                            <Route path='/folders' element={<Folders/>}/>
                            <Route path='/pdf-viewer/:userId' element={<PdfViewer/>}/>
                            <Route path='/note-creator' element={<NoteCreator/>}/>
                            <Route path='/note-creator/:id' element={<NoteCreator/>}/>
                            <Route path='/folder-notes/:id' element={<FolderNotes/>}/>
                            <Route path='/book-settings/:id' element={<BookSettings/>}/>
                            <Route path='/settings' element={<UserSettings/>}/>
                        </Routes>
                    </div>
                    : <AuthWrapper/>
                }
            </AuthContext.Consumer>
        </AuthProvider>
    )
}

export default App