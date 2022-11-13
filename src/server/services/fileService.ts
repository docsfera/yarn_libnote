import fs from "fs"

export const createDir = (file: any) => {
    const filePath = `C:\\Users\\Admin\\Desktop\\libnote\\files\\${file.md5}`


    return new Promise(((resolve, reject) => {
        try {
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath)

                return resolve({message: "File was created"})
            } else{
                return resolve({message: "File already exist"})
            }
        } catch (e) {
            return reject({message: "File error"})
        }
    }))

}
