import express, {json} from "express"
import {graphqlHTTP} from "express-graphql"
import cors from "cors"
import {buildSchema} from "graphql"
import fileUpload, {UploadedFile} from "express-fileupload"
import pg from "pg"
import path from "path"
import {body, validationResult} from "express-validator"
import jwt from "jsonwebtoken"
import { default as bcrypt } from "bcryptjs"






//@ts-ignore
import {createDir} from "./services/fileService.ts"
import fs from "fs";


const Pool = pg.Pool
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'libnote',
//     password: 'tankionline',
//     port: 5432,
// });

const pool = new Pool({
    user: 'postgres',
    host: 'containers-us-west-75.railway.app',
    database: 'railway',
    password: 'JPCNSobjAxF9K7JvrMXu',
    port: 6260,
});

const schema = buildSchema(`
    type User{
        id: ID
        mail: String  
        password: String
    }
    type Book{
        id: ID
        name: String
        utfname: String
        image: String
    }
    type Folder{
        id: ID
        userid: ID
        name: String
        countofnotes: Int
    }
    
    type Note{
        id: ID
        title: String
        folderid: ID
        bookid: ID
        content: String
        datecreate: String
        dateupdate: String
    }
    
    input UserInput {
        id: ID
        mail: String!
        password: String!
    }
    input FolderInput{
        id: ID
        name: String!
        userid: ID!
        countofnotes: Int!
    }
    input BookInput{
        id: ID
        name: String!
        image: String!
        userid: ID!
    }
    
    input NoteInput {
        id: ID
        userid: ID!
        bookid: ID
        folderid: ID
        title: String!
        content: String!
        datecreate: String!
        dateupdate: String!
    }
    
    type Query {
        getAllUsers: [User]
        getNoteById(id: ID): Note
        getUserById(id: ID): User
        getUserByToken(token: String): User
        getUser(input: UserInput): User
        
        getBookById(id: ID): Book
        getFolderById(id: ID): Folder
        getAllNotes(userid: ID): [Note]
        getAllFolders(userid: ID): [Folder]
        getAllBooks(userid: ID): [Book]
        getNotesByFolder(folderid: ID): [Note] 
        getNotesByBookId(id: ID): [Note]
        
        getUserPasswordByLogin(input: UserInput): User
        
        
    }
    scalar Upload
    type Mutation {
        createFolder(input: FolderInput): Folder
        createBook(input: BookInput): Book
        createUser(input: UserInput): User
        createNote(input: NoteInput): Note
        deleteNoteById(noteid: ID): Note
        deleteBookById(id: ID, userId: ID): Book
        deleteFolderById(id: ID): Folder
        updateFolderName(id: ID, name: String): Folder
        updateFolderCountNotes(folderid: ID, mode: String): Folder
        updateNote(input: NoteInput): Note
        updateBookName(id: ID, name: String): Book
        
        updateUserName(id: ID, name: String): User
        updateUserPassword(id: ID, password: String): User
        
        downloadBook(file: Upload!) : Book
        saveBase64(base64: String, bookId: ID, userId: ID): Book
       
    }

`)

const app = express()
app.use(cors())
app.use(fileUpload())

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

const root = {

    getAllUsers: async () => await pool.query('SELECT * FROM users')
        .then((res: { rows: any }) => res.rows)
    ,
    getUserById: async (params: any) =>
        await pool.query('SELECT * FROM users WHERE id = ($1)'
            , [params.id])
            .then((res: { rows: any[] }) => res.rows[0])
    ,

    getUser: async ({input}: any) => await pool.query('SELECT * FROM users WHERE mail = ($1)'
        , [input.mail]).then((res: { rows: any[] }) => res.rows[0])

    ,
    getUserByToken: async (token: any) => await pool.query('SELECT * FROM users WHERE id = ($1)'
                //@ts-ignore
            , [ jwt.verify(token.token, 'volod').id]).then(res => res.rows[0])

    ,
    getNoteById: async ({id}: any) => await pool.query('SELECT * FROM notes WHERE id = ($1)'
    , [id])
    .then((res: { rows: any[] }) => res.rows[0])
    ,
    getBookById: async ({id}: any) => await pool.query('SELECT * FROM books WHERE id = ($1)'
        , [id])
        .then((res: { rows: any[] }) => res.rows[0])

    ,
    getFolderById: async ({id}: any) => await pool.query('SELECT * FROM folders WHERE id = ($1)'
        , [id])
        .then((res: { rows: any[] }) => res.rows[0])
    ,
    createUser: async (input : any) => await pool.query('INSERT INTO users (mail, password) VALUES ($1, $2) RETURNING *',
            [input.mail, input.password]).then((res: { rows: any[] }) => res.rows[0])

    ,
    createNote: async ({input}: any) => {
        await pool.query('INSERT INTO notes (userid, folderid, bookid, title, content, datecreate, dateupdate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            , [input.userid, input.folderid, input.bookid, input.title, input.content, input.datecreate, input.dateupdate])
            .then((res: { rows: any[] }) => res.rows[0])

        if(input.folderid) {
            const countOfNotes = await pool.query('SELECT countofnotes FROM folders WHERE id = ($1)',
                [+input.folderid]).then((res: { rows: { countofnotes: any }[] }) => res.rows[0].countofnotes)

            await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                , [countOfNotes + 1, +input.folderid])
        }
    }
    ,

    getUserPasswordByLogin: async ({input}: any) => await pool.query('SELECT password FROM users WHERE mail = ($1)',
            [input.mail]).then((res: { rows: { password: string }[] }) => res.rows[0].password)




    ,
    getAllNotes: async ({userid}: any) => await pool.query('SELECT * FROM notes WHERE userid = ($1) ORDER BY dateupdate DESC'
        , [+userid])
        .then((res: { rows: any }) => res.rows)
    ,
    getAllBooks : async ({userid}: any) => await pool.query('SELECT * FROM books WHERE userid = ($1)'
        , [+userid])
        .then((res: { rows: any }) => res.rows)
    ,
    deleteNoteById: async ({noteid}: any) =>
        await pool.query('DELETE FROM notes WHERE id = ($1) RETURNING *'
            , [+noteid])
            .then( async (res: { rows: any[] }) =>  {
                if(res.rows[0].folderid) {
                    const countOfNotes = await pool.query('SELECT countofnotes FROM folders WHERE id = ($1)',
                        [+res.rows[0].folderid]).then((res: { rows: { countofnotes: any }[] }) => res.rows[0].countofnotes)
                    await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                        , [countOfNotes - 1, +res.rows[0].folderid])
                }
                return res.rows[0]
            })
    ,

    deleteBookById: async ({id, userId}: any) => {
        const bookNameUTF = await pool.query('SELECT utfname FROM books WHERE id = ($1)',
            [+id]).then((res: { rows: { utfname: any }[] }) => res.rows[0].utfname)

        await pool.query('UPDATE notes SET bookid = ($2) WHERE bookid = ($1)',
            [+id, null]).then((res: { rows: any[] }) => res.rows)

        //TODO: delete image!

        await pool.query('DELETE FROM books WHERE id = ($1) RETURNING *', [+id])
            .then(res => {
                fs.unlinkSync(path.join('D:/libnote/libnote/public/files', userId, bookNameUTF))
                return res
            })
            .then((res: { rows: any[] }) => res.rows[0])
    },

    deleteFolderById: async ({id}: any) => { //TODO: doent send response
        await pool.query('UPDATE notes SET folderid = null WHERE folderid = ($1)', [+id])
            .then(() => pool.query('DELETE FROM folders WHERE id = ($1) RETURNING *'
            , [+id])).then((res: { rows: any[] }) => {
                console.log(res.rows[0])
                return res.rows[0]
            })
    }
    ,
    createBook: async ({input}: any) => await pool.query('INSERT INTO books (userid, name, image) VALUES ($1, $2, $3) RETURNING *'
            , [input.userid, input.name, input.image])
            .then((res: { rows: any[] }) => res.rows[0])

    ,
    createFolder: async ({input}: any) => await pool.query('INSERT INTO folders (userid, name, countofnotes) VALUES ($1, $2, $3) RETURNING *'
        , [input.userid, input.name, input.countofnotes])
        .then((res: { rows: any[] }) => res.rows[0])
    ,
    updateFolderName: async ({id, name}: any) => await pool.query('UPDATE folders SET name = ($1) WHERE id = ($2) RETURNING *'
        , [name, id])
        .then((res: { rows: any[] }) => {res.rows[0]; console.log(name, id)})
    ,
    updateNote: async ({input}: any) => {
        await pool.query('UPDATE notes SET folderid = ($2), bookid = ($3), title = ($4), content = ($5), datecreate = ($6), dateupdate = ($7) WHERE id = ($1) RETURNING *'
            , [input.id, input.folderid, input.bookid, input.title, input.content, input.datecreate, input.dateupdate])
            .then((res: { rows: any[] }) => res.rows[0])
    }
    ,
    updateUserName: async ({id, name}: any) =>
        await pool.query('UPDATE users SET mail = ($2) WHERE id = ($1) RETURNING *', [id, name])
        .then((res: { rows: any[] }) => res.rows[0])
    ,
    updateUserPassword: async ({id, password}: any) =>
        await pool.query('UPDATE users SET password = ($2) WHERE id = ($1) RETURNING *'
            , [id, bcrypt.hashSync(password, 1)])
            .then((res: { rows: any[] }) => res.rows[0])


    ,
    updateFolderCountNotes: async ({folderid, mode}: any) => {
        const countofnotes = await pool.query('SELECT countofnotes FROM folders WHERE id = ($1)',
            [+folderid]).then((res: { rows: { countofnotes: any }[] }) => res.rows[0].countofnotes)

        if(mode === "-"){
            await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                , [countofnotes - 1, +folderid])
        }else{
            await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                , [countofnotes + 1, +folderid])
        }
    }
    ,
    updateBookName: async ({id, name}: any) =>
        await pool.query('UPDATE books SET name = ($2) WHERE id = ($1) RETURNING *', [+id, name])
            .then((res: { rows: any[] }) => res.rows[0])

    ,
    getAllFolders: async ({userid}: any) => await pool.query('SELECT * FROM folders WHERE userid = ($1)'
        , [+userid])
        .then((res: { rows: any }) => res.rows)
    ,
    getNotesByFolder: async ({folderid}: any) => await pool.query('SELECT * FROM notes WHERE folderid = ($1)'
        , [+folderid]).then((res: { rows: any }) => res.rows)
    ,
    getNotesByBookId: async ({id}: any) => await pool.query('SELECT * FROM notes WHERE bookid = ($1)'
        , [+id]).then((res: { rows: any }) => res.rows)
    ,

    downloadBook: (file: UploadedFile | undefined | null, userId: string, fileName: string, UTFName: string) => {
        if (file){
            const intendedFilePath = path.join('D:/libnote/libnote/public/files', userId)
            console.log(intendedFilePath, fs.existsSync(intendedFilePath))

            try {
                if(fs.existsSync(intendedFilePath)) {
                    file.mv(path.join('D:/libnote/libnote/public/files', userId, UTFName))
                    pool.query('INSERT INTO books (userid, name, image, utfname) VALUES ($1, $2, $3, $4)', [userId, fileName, "", UTFName])
                } else{
                    fs.mkdirSync(intendedFilePath)
                    console.log({message: "File already exist"})
                }
            } catch (e) {
                console.log({message: "File error", e})
            }
        }else{
            console.log('qq')
        }

    }
    ,

    saveBase64: async (base64: string, bookId: any, userId: any) => {
        //@ts-ignore
        let base64Data = base64.base64.replace(/^data:image\/png;base64,/, "")

        const getNameImg = () => {
            return `${Math.floor(Math.random() * 1e10)}.png`
        }
        let imgName = getNameImg()
        console.log(imgName, bookId.body.variables.bookId, bookId.body.variables.userId) // TODO: fix
        let isFileExist = true
        let filePath = path.join('D:/libnote/libnote/public/files/', bookId.body.variables.userId, imgName)
        console.log(filePath)
        while (isFileExist) {
            if (fs.existsSync(filePath)){
                imgName = getNameImg()
            }else {
                isFileExist = false
                fs.writeFileSync(filePath, base64Data, 'base64')
            }
        }
        await pool.query('UPDATE books SET image = ($2) WHERE id = ($1) RETURNING *'
            , [+bookId.body.variables.bookId, imgName])
            .then((res: { rows: any[] }) => res.rows[0])
    }
    ,


}




app.post('/', function(req, res) {
    //@ts-ignore
    const file = (req && req.files) && req.files.file as UploadedFile
    const userId = req.body.userId
    const fileName = req.body.fileName
    const UTFName = req.body.UTFName

    console.log({fileName, UTFName})

    //localStorage.setItem("userId", JSON.stringify(1))

    root.downloadBook(file, userId, fileName, UTFName)
})

app.post('/registration',
    body('mail', 'Login must be longer than 3 and shorter than 12')
        .trim()
        .isLength({ min: 3, max: 12 }),
    // password must be at least 5 chars long
    body('password', 'Password must be longer than 5')
        .trim()
        .isLength({ min: 5 })
        .custom(async (password, {req}) => {
            const confirmPassword = req.body.confirmPassword
            if(password !== confirmPassword){
                throw new Error('Passwords must be same')
            }
        }),
    function(req, res) {
        try{
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(401).json({message: errors.array()[0].msg})
            }else{
                const {mail, password} = req.body
                const hashPassword = bcrypt.hashSync(password, 1)

                root.createUser({mail, password: hashPassword}).then( data => {
                    if (data){
                        console.log(data.id)
                        fs.mkdirSync(`D:/libnote/libnote/public/files/${data.id}`)
                    }
                })

                return res.status(200).json({message: "ok"});
            }
        }catch (e) {
            return res.status(401).json({message: "Server Error"})
        }
});

app.post('/login',
    body('mail', 'Login must be longer than 3 and shorter than 12')
        .trim()
        .isLength({ min: 3, max: 12 }),
    // password must be at least 5 chars long
    body('password', 'Password must be longer than 5')
        .trim()
        .isLength({ min: 5 }),

    (req, res) => {
        try{
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(401).json({message: errors.array()[0].msg})
            }else{
                const {mail, password} = req.body
                const hashPassword = bcrypt.hashSync(password, 1)

                root.getUser({input: {mail, password: hashPassword}}).then(data => {
                    if(data){
                        const isPassValid = bcrypt.compareSync(password, data.password)
                        console.log(isPassValid)
                        if (!isPassValid) {
                            return res.status(400).json({message: "Invalid password"})
                        }
                        const token = jwt.sign({id: data.id},  'volod', {expiresIn: "1h"})

                        return res.status(200).json({message: "ok", user: {mail: data.mail, id: data.id, token}})
                    }else{
                        return res.status(400).json( {message:"User with such a login does not exist"})
                    }
                })





                //createDir

            }
        }catch (e) {
            return res.status(401).json({message: "Server Error"})
        }
    });


app.post('/changePassword',

    body('newPassword', 'Password must be longer than 5')
        .trim()
        .isLength({ min: 5 })
        .custom(async (newPassword, {req}) => {
            const confirmPassword = req.body.confirmPassword
            if(newPassword !== confirmPassword){
                console.log({newPassword, confirmPassword})
                throw new Error('Passwords must be same')
            }
        }),
    function(req, res) {
        try{
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(401).json({message: errors.array()[0].msg})
            } else {
                const {id, oldPassword} = req.body

                root.getUserById({id}).then((data: any) => {
                    if(data) {
                        const isOldPassRight = bcrypt.compareSync(oldPassword, data.password)
                        if (!isOldPassRight) {
                            return res.status(400).json({message: "Invalid password"})
                        }
                        return res.status(200).json({message: "ok"})
                    }else{
                        return res.status(401).json({message: "Server Error"})
                    }
                })
            }
        }catch (e) {
            return res.status(401).json({message: "Server Error"})
        }
    });


app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
        rootValue: root
    }
))

app.set('port', process.env.PORT || 3001)

const server = app.listen(app.get('port'), function() {
    console.log('listening');
});
