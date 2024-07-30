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
    "private_key": process.env.NODE_ENV === "production" ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY).private_key : process.env.FIREBASE_PRIVATE_KEY,
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

const db = admin.firestore();

const app = express()

app.use(corsPolicy);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/meow', (req, res) => {
    res.send('pss pss pss pss')
})

app.post('/login', async (req, res) => {
    const data = req.body

    // data validation
    if (!utils.assertLoginData(req, data)) {
        r.invalidData(res)
        return
    }

    utils.apiLog(req, `Requesting login to: ${data.email} ${data.hash}`)

    try {
        const docRef = db.collection('users').doc(data.email);
        const doc = await docRef.get()

        // check if email is valid
        if (!doc.exists) {
            utils.apiLog(req, `Failed to log in user: ${data.email}`)
            r.failedLogin(res, 'Invalid Credentials.')
            return
        }

        // check if exceeding login attempt limit
        if (doc.data().login_attempt >= 3) {
            utils.apiLog(req, `Failed to log in user: ${data.email}`)
            r.failedLogin(res, 'No attempts remaining. Developer account locked.')
            return
        }

        // check if hash is same
        if (doc.data().hash !== data.hash) {
            // increment login attempt counter for the email
            if (doc.data().login_attempt < 3) {
                await db.collection('users').doc(data.email).update({
                    login_attempt: doc.data().login_attempt + 1
                })
            }

            utils.apiLog(req, `Failed to log in user: ${data.email}`)
            r.failedLogin(res, `Invalid Credentials. ${(doc.data().login_attempt + 1 < 3 ? 3 - doc.data().login_attempt + 1 : 'No')} attempts remaining.`)
            return
        }

        await db.collection('users').doc(data.email).update({
            login_attempt: 1
        })

        const clientToken = await admin.auth().createCustomToken(data.email)

        utils.apiLog(req, `User successfully logged in: ${data.email}`)
        r.success(res, { clientToken })
    } catch (err) {
        utils.apiLog(req, `Failed to log in user: ${data.email}`)
        r.internalServerErrorOccured(res)
    }
})

// Dynamic API for saving project or technology
app.post('/save', async (req, res) =>{
    const data = req.body

    // Determine if data is project or technology
    const isProject = data.technologyId === undefined 
    const categoryType = isProject ? 'project' : 'technology'
    
    // data validation
    if (!utils.assertPostSaveData(req, isProject, data)) {
        r.invalidData(res)
        return
    }

    utils.apiLog(req, `Saving ${categoryType}: ${data.name}, ${data}`)

    try {
        // Verify token
        await admin.auth().verifyIdToken(data.idToken)

        // upload all data to firestore
        const docRef = db.collection(isProject ? 'projects' : 'technologies').doc(isProject ? data.projectId : data.technologyId)

        // delete idToken & projectId from object data
        delete data.idToken
        isProject ? delete data.projectId : delete data.technologyId

        await docRef.update(data)

        // give response
        utils.apiLog(req, `Successfully saved ${categoryType}: ${data.name}`)
        r.success(res)
    } catch (err) {
        utils.apiLog(req, `Failed to save ${categoryType}: ${data.name}`)
        r.internalServerErrorOccured(res)
    }
})

// Dynamic API for creating new project or technology
app.post('/new_id', async (req, res) => {
    const data = req.body

    // Determine if data is project or technology
    const isProject = data.technologyId === undefined 
    const categoryType = isProject ? 'project' : 'technology'

    if (!utils.assertPostNewData(req, data)) {
        r.invalidData(res)
        return
    }

    utils.apiLog(req, `Creating new ${categoryType}...`)

    try {
        // Verify token
        await admin.auth().verifyIdToken(data.idToken)

        const newDoc = await db.collection(isProject ? 'projects' : 'technologies').add({})

        utils.apiLog(req, `Successfully create new ${categoryType}: ${newDoc.id}`)
        r.success(res, isProject ? {projectId: newDoc.id} : {technologyId: newDoc.id})
    } catch (err) {
        utils.apiLog(req, `Failed to create new ${categoryType}: ${err}`)
        r.internalServerErrorOccured(res)
    }
})

// Dynamic API for deleting project or technology
app.post('/delete', async (req, res) => {
    const data = req.body

    // Determine if data is project or technology
    const isProject = data.technologyId === undefined 
    const categoryType = isProject ? 'project' : 'technology'

    if (!utils.assertPostDeleteData(req, isProject, data)) {
        r.invalidData(res)
        return
    }

    const categoryId = isProject ? data.projectId : data.technologyId

    utils.apiLog(req, `Deleting ${categoryType}: ${categoryId}...`)

    try {
        // Verify token
        await admin.auth().verifyIdToken(req.body.idToken)
        
        db.collection(isProject ? 'projects' : 'technologies').doc(categoryId).delete()

        utils.apiLog(req, `Successfully deleted ${categoryType}: ${categoryId}.`)
        r.success(res)
    } catch (err) {
        utils.apiLog(req, `Failed to delete ${categoryType}: ${categoryId}.`)
        r.internalServerErrorOccured(res)
    }
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

module.exports = app;