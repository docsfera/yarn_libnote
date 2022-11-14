import React, {useRef} from 'react'
import "./Book.sass"

type BookType = {
    id: any
    name: string
    UTFName: string
    userId: string
    pimp: any
    imageName: string
    showBookSettings: any
}

const Book: React.FC<BookType> = (props) => {
    return (
        <div className="book" onClick={() => props.pimp(props.UTFName)}>
            <img src="/images/book-settings.png"
                 className="book-settings"
                 onClick={e => props.showBookSettings(e, props.id)}>
            </img>

            {props.imageName
                ? <img src={`/files/${props.userId}/${props.imageName}`} alt="" className="image"/>
                :  <img src={"/images/non-found-book.png"} alt="" className="image"/>}

            <p className="book-name">{props.name}</p>
        </div>
    );
};

export default Book;