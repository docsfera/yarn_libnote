import React, {useEffect, useRef} from 'react'
import "./Book.sass"
import withSearchMark from "../../HOC/withSearchMark"

type BookType = {
    book: any
    userId: string
    pimp: any
    showBookSettings: any
    searchWord?: string
    insertMarkHTML: any
}

const Book: React.FC<BookType> = (props) => {
    const bookNameRef = useRef<HTMLParagraphElement>(null)
    useEffect(() => {
        if(bookNameRef && bookNameRef.current){
            bookNameRef.current.innerHTML = props.insertMarkHTML(props.book.name, props.searchWord)
        }
    }, [props])


    console.log({book: props.book})
    return (
        <div className="book" onClick={() => props.pimp(props.book)}>
            <img src="/images/book-settings.png"
                 className="book-settings"
                 onClick={e => props.showBookSettings(e, props.book.id)}>
            </img>

            {props.book.image
                ? <img src={`/files/${props.userId}/${props.book.image}`} alt="" className="image"/>
                :  <img src={"/images/non-found-book.png"} alt="" className="image"/>}

            <p ref={bookNameRef} className="book-name">{props.book.name}</p>
        </div>
    );
};

export default withSearchMark(Book)