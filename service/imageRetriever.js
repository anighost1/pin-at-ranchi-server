import { fs } from 'memfs'
import { gfs } from '../index.js'
import mongoose from 'mongoose'

const imageRetriever = async (img, imgArray) => {
   await new Promise((resolve, reject) => {
        const inMemoryStream = fs.createWriteStream('/outputFile');
        gfs.openDownloadStream(new mongoose.Types.ObjectId(img.gridfsId)).pipe(inMemoryStream)
        inMemoryStream.on('finish', () => {
            const inMemoryFileContent = fs.readFileSync('/outputFile');
            const base64 = Buffer.from(inMemoryFileContent).toString('base64')
            imgArray.push({
                ...img._doc,
                image: `data:${img.mimetype};base64,${base64}`
            })
            resolve()
        });
        inMemoryStream.on('error', reject)
    })
}

export default imageRetriever