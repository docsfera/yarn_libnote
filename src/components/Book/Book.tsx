import React, {useRef} from 'react'
import "./Book.sass"

type BookType = {
    name: string
    UTFName: string
    pimp: any
    imageName: string
}

const Book: React.FC<BookType> = (props) => {
    return (
        <div className="book" onClick={() => props.pimp(props.UTFName)}>
            {props.imageName
                ? <img src={`/files/1/${props.imageName}`} alt="" className="image"/>
                :  <img src={"/images/non-found-book.png"} alt="" className="image"/>}

            <p className="book-name">{props.name}</p>
        </div>
    );
};

export default Book;