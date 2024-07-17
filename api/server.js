const admin = require("firebase-admin");
const express = require('express')
const cors = require('cors');
require('dotenv').config();
const r = require('./response.js')
const utils = require("./utils.js")

console.log('Initializing server...')

let corsPolicy = cors()
let serviceAccount = {
    "type": "service_account",
    "project_id": "portfolio-7469a",
    "private_key_id": "790f4b86b558aabbcb46dc7772209a27530a52fd",
    "private_key": process.env.FIREBASE_ADMIN_API_KEY,
    "client_email": "firebase-adminsdk-r3cmv@portfolio-7469a.iam.gserviceaccount.com",
    "client_id": "115277687454215232015",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r3cmv%40portfolio-7469a.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express()

app.use(corsPolicy);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/test', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', async (req, res) => {
    const db = admin.firestore();
    const email = req.body.email;
    const hash = req.body.hash

    // // data validation
    // if (!utils.isCleanCode(darkRoomCode)) {
    //     r.invalidData(res)
    //     return
    // }

    utils.apiLog(req, `Requesting login to: ${email} ${hash}`)

    try {
        const docRef = db.collection('users').doc(email);
        const doc = await docRef.get()

        // check if email is valid
        if (!doc.exists) {
            utils.apiLog(req, `Failed to log in user: ${email}`)
            r.failedLogin(res, 'Invalid Credentials.')
            return
        }

        // check if exceeding login attempt limit
        if (doc.data().login_attempt >= 3) {
            utils.apiLog(req, `Failed to log in user: ${email}`)
            r.failedLogin(res, 'No attempts remaining. Developer account locked.')
            return
        }

        // check if hash is same
        if (doc.data().hash !== hash) {
            // increment login attempt counter for the email
            if (doc.data().login_attempt < 3) {
                db.collection('users').doc(email).update({
                    login_attempt: doc.data().login_attempt + 1
                })
            }

            utils.apiLog(req, `Failed to log in user: ${email}`)
            r.failedLogin(res, `Invalid Credentials. ${(doc.data().login_attempt + 1 < 3 ? 3 - doc.data().login_attempt + 1 : 'No')} attempts remaining.`)
            return
        }

        db.collection('users').doc(email).update({
            login_attempt: 1
        })

        const clientToken = await admin.auth().createCustomToken(email)

        utils.apiLog(req, `User successfully logged in: ${email}`)
        r.success(res, { clientToken })
    } catch (err) {
        utils.apiLog(req, `Failed to log in user: ${email}`)
        r.internalServerErrorOccured(res)
    }
})

// ADD TOKEN VERIFICATION
app.post('/save', async (req, res) => {
    const db = admin.firestore();
    const data = req.body

    // data validation
    if (!utils.isCleanData(req, data)) {
        r.invalidData(res)
        return
    }

    utils.apiLog(req, `Saving project: ${data.name}, ${data}`)

    try {
        // upload all data to firestore
        const docRef = db.collection('projects').doc(data.projectId)

        // delete idToken from object data
        delete data.idToken

        await docRef.update(data)

        // give response
        utils.apiLog(req, `Project successfully saved: ${data.name}`)
        r.success(res)
    } catch (err) {
        utils.apiLog(req, `Failed to save project: ${data.name}`)
        r.internalServerErrorOccured(res)
    }
})

// ADD TOKEN VERIFICATION
app.post('/new_project_id', async (req, res) => {
    const db = admin.firestore();

    utils.apiLog(req, 'Creating new project...')

    try {
        const newProject = await db.collection('projects').add({})

        utils.apiLog(req, `Successfully create new project: ${newProject.id}`)
        r.success(res, {projectId: newProject.id})
    } catch (err) {
        utils.apiLog(req, `Failed to create new project: ${err}`)
        r.internalServerErrorOccured(res)
    }
})

app.post('/delete', (req, res) => {
    const db = admin.firestore();
    const data = req.body

    utils.apiLog(req, `Deleting project: ${data.projectId}...`)

    try {
        db.collection('projects').doc(data.projectId).delete()

        utils.apiLog(req, `Successfully deleted project: ${data.projectId}.`)
        r.success(res)
    } catch (err) {
        utils.apiLog(req, `Failed to delete project: ${data.projectId}.`)
        r.internalServerErrorOccured(res)
    }
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});