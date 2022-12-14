import React, {useCallback, useEffect, useRef, useState} from 'react'
import "./Books.sass"
import Header from "../Header/Header";
import pdfjs from "pdfjs-dist"
import {gql, useMutation, useQuery} from "@apollo/client"
import {NavLink, useNavigate} from "react-router-dom"
import Book from "../Book/Book";
import html2canvas from "html2canvas"
//@ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import CyrillicToTranslit from "cyrillic-to-translit-js"
import SectionInfo from "../SectionInfo/SectionInfo";

const pdfjsLib = require("pdfjs-dist/build/pdf")
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer")

type BooksType = {
    userInfo: any
}

const GG = gql`
    mutation downloadBook($file: Upload!){
        downloadBook(file: $file){
            id
        }
    } 
`
const GET_ALL_BOOKS = gql`
    query getAllBooks($userid: ID){
        getAllBooks(userid: $userid){
            id
            name
            utfname
            image
        }
    }
`

const SAVE_BASE_64 = gql`
    mutation($base64: String, $bookId: ID, $userId: ID){
        saveBase64(base64: $base64, bookId: $bookId, userId: $userId) {
            id

        }
    }

`


const Books: React.FC<BooksType> = (props) => {
    const navigate = useNavigate()
    //@ts-ignore
    const cyrillicToTranslit = new CyrillicToTranslit()
    const [mut] = useMutation(GG)
    const {data, refetch} = useQuery(GET_ALL_BOOKS, {variables:{userid: props.userInfo.id}, pollInterval: 500})
    const [saveBase64] = useMutation(SAVE_BASE_64)

    const [isBookLoading, setIsBookLoading] = useState(false)

    const refCanvas = useRef(null)
    const smokeWindow = useRef<HTMLDivElement>(null) // TODO: create component

    let booksCount
    data?.getAllBooks ? booksCount = data.getAllBooks.length : booksCount = 0

    const [searchWord, setSearchWord] = useState("")

    useEffect(() => {
        if(smokeWindow && smokeWindow.current){
            smokeWindow.current.style.height = `${smokeWindow.current.ownerDocument.body.offsetHeight}px`
        }
    },[smokeWindow, smokeWindow.current])

    useEffect(() => {
        if(data && data.getAllBooks) {
            data.getAllBooks.map((i: any, index: any) => {
                if (!i.image) {
                    let bookUrl = `http://localhost:3000/files/${props.userInfo.id}/${i.utfname}`
                    setCanvas(refCanvas, bookUrl, i.id)
                }
            })
        }
    }, [data, refCanvas])

    const setCanvas = (refCanvas: any, bookUrl: string, bookId: string) => {
        console.log({bookUrl})
        const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL//"https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        let loadingTask = pdfjsLib.getDocument(bookUrl)

        loadingTask.promise.then((pdfDocument: any) => {
            pdfDocument.getPage(1).then((page: any) => {
                let scale = 555
                let viewport = page.getViewport(scale)
                let canvas = refCanvas.current
                if (canvas) {
                    let context = canvas.getContext('2d');
                    viewport.height = canvas.height
                    viewport.width = canvas.width
                    let renderContext = {canvasContext: context, viewport: viewport}
                    let renderTask = page.render(renderContext)

                    renderTask.promise.then(async () => {
                        let base64image = canvas.toDataURL("image/png")
                        await saveBase64({variables: {base64: base64image, bookId: bookId, userId: props.userInfo.id} })
                        // html2canvas(document.getElementById("pageContainer")).then((canvas) => {
                        //     let base64image = canvas.toDataURL("image/png")
                        // })
                    })
                }
            })
        })
    }

    const onDrop =  useCallback(async (acceptedFiles: any[]) =>  {
        let file = acceptedFiles[0]
        console.log(file)
        await mut({variables: {file} })
    }, [])

    const pimp = (book: any) => {
        navigate(`../pdf-viewer/${props.userInfo.id}`, {state: {book}}) // TODO: useQuery(getBookByID)???
    }

    const uploadFile = (file: any) => {
        setIsBookLoading(true)
        let formData = new FormData()

        const UTFName = cyrillicToTranslit.transform(file.name, "_")
        formData.append('file', file)
        formData.append('fileName', file.name)
        formData.append('userId', props.userInfo.id)
        formData.append('UTFName', UTFName)
        fetch('/', { // TODO: updating page!!!!
            method: 'POST',
            body: formData
        })
            .then((e) => setIsBookLoading(false))
            .catch((e) => console.log('catch', e))
        setIsBookLoading(false)
    }

    const changeUploadFile = (e: any) => {
        e.preventDefault()
        if(e.dataTransfer){
            if(e.dataTransfer.files[0].type === "application/pdf"){
                console.log()
                uploadFile(e.dataTransfer.files[0])
            }else{
                (dropArea && dropArea.current) && dropArea.current.classList.add('error')
            }
        }else{
            uploadFile(e.target.files[0])
        }
    }

    const dropArea = useRef<HTMLDivElement>(null)

    const go = () => (dropArea && dropArea.current) && dropArea.current.classList.add('highlight')
    const gone = () => (dropArea && dropArea.current) && dropArea.current.classList.remove('highlight')

    const showBookSettings = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, bookId: string) => {
        e.stopPropagation()
        navigate(`../book-settings/${bookId}`)
    }

    const condition = (book: any, searchWord: string) => {
        if(book.name.toLowerCase().includes(searchWord.toLowerCase())){
            return book
        }
    }

    return (
        <div>
            <Header setSearchWord={setSearchWord} searchWord={searchWord} isShow={true}/>
            <div className="books-container">
                <SectionInfo nameSection="Books" sectionCount={booksCount}/>

                <div className="books">
                    {/*<div ref={smokeWindow} className="smoke"> </div>*/}
                    {data && data.getAllBooks.filter((i: any) => condition(i, searchWord)).map((i: any) =>
                        <Book
                            key={i.id}
                            book={i}
                            userId={props.userInfo.id}
                            pimp={pimp}
                            showBookSettings={showBookSettings}
                            searchWord={searchWord}
                        />)
                    }

                    {isBookLoading &&
                        <div className="loading-book">
                            5
                        </div>
                    }

                    <div id="drop-area"
                         ref={dropArea}
                         onDragEnter={go}
                         onDragOver={go}
                         onDragLeave={gone}
                         onDrop={(e) => {gone(); changeUploadFile(e)}}>

                        <input type="file" id="fileElem" accept="application/pdf" onChange={(e) => changeUploadFile(e)}/>
                    </div>


                </div>

                <canvas ref={refCanvas} width="570" height="760" className="canvas"></canvas>

            </div>


        </div>
    );
};

export default Books