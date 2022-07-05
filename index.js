import express from 'express';
import AWS from 'aws-sdk';
import keys from './config/keys.js'
import bucket from './config/bucket.js'

const app = express();
const PORT = process.env.PORT || 5001;


app.get('/', (req, res) => {
    AWS.config.update(keys);
    let s3 = new AWS.S3();

    async function getImage(){
        const data = s3.getObject(bucket).promise();
        return data;
    }

    const encode = data => {
        let buf = Buffer.from(data);
        let base64 = buf.toString('base64');
        return base64;
    }

    getImage().then( img =>  {
        let image="<img src='data:image/jpeg;base64," + encode(img.Body) + "'" + "/>";
        let startHTML = "<html><body></body>";
        let endHTML = "</body></html>";
        let html = startHTML + image + endHTML;
        res.send(html)
        }).catch( (e) => {
            res.send(e)
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
