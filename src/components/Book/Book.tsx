import React, {useEffect, useRef} from 'react'
import "./Book.sass"
import withSearchMark from "../../HOC/withSearchMark"

type BookType = {
    id: any
    name: string
    UTFName: string
    userId: string
    pimp: any
    imageName: string
    showBookSettings: any
    searchWord?: string
    insertMarkHTML: any
}

const Book: React.FC<BookType> = (props) => {
    const bookNameRef = useRef<HTMLParagraphElement>(null)
    useEffect(() => {
        if(bookNameRef && bookNameRef.current){
            bookNameRef.current.innerHTML = props.insertMarkHTML(props.name, props.searchWord)
        }
    }, [props])

    return (
        <div className="book" onClick={() => props.pimp(props.UTFName)}>
            <img src="/images/book-settings.png"
                 className="book-settings"
                 onClick={e => props.showBookSettings(e, props.id)}>
            </img>

            {props.imageName
                ? <img src={`/files/${props.userId}/${props.imageName}`} alt="" className="image"/>
                :  <img src={"/images/non-found-book.png"} alt="" className="image"/>}

            <p ref={bookNameRef} className="book-name">{props.name}</p>
        </div>
    );
};

export default withSearchMark(Book)