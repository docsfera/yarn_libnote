import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Aside from "./components/Aside/Aside"
import AuthWrapper from "./components/AuthWrapper/AuthWrapper"
import Main from "./components/Main/Main"
import Books from "./components/Books/Books";
import Notes from "./components/Notes/Notes";
import NoteCreator from "./components/NoteCreator/NoteCreator";
import FolderNotes from "./components/FolderNotes/FolderNotes";
import PdfViewer from "./components/PdfViewer/PdfViewer";
import {gql, useQuery} from "@apollo/client";
import AuthProvider, {AuthContext} from "./AuthProvider"
import Header from "./components/Header/Header";

const GET_USER_BY_ID = gql`
    query getUserById($id: ID) {
        getAllFolders(id: $id){
            id
        }
    }
`



function App() {
  //const user = useQuery(GET_USER_BY_ID, {variables: {id: "1"}}).data





  //console.log(localStorage.getItem('token'))

  return (
      <AuthProvider>
        <AuthContext.Consumer>

          {value => value.userInfo.token ?
              <div className="App">
                <Aside/>
                {/*<Header/>*/}
                <Routes>
                  <Route path='/' element={<Main/>}/>
                  <Route path='/books' element={<Books userInfo={value.userInfo}/>}/>
                  <Route path='/notes' element={<Notes />}/>
                  <Route path='/pdf-viewer/:userId' element={<PdfViewer />}/>
                  <Route path='/note-creator' element={<NoteCreator />}/>
                  <Route path='/note-creator/:id' element={<NoteCreator />}/>
                  <Route path='/folder-notes/:id' element={<FolderNotes />}/>
                  {/*<Route path='/auth' element={<AuthWrapper />}/>*/}

                </Routes>

              </div> : <AuthWrapper/>
          }
        </AuthContext.Consumer>

      </AuthProvider>
  );
}

export default App;

