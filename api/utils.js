function isCleanData(req, data) {
  const stringData = ['idToken', 'projectId', 'name', 'description', 'technologies', 'details']

  try {
    stringData.forEach(key => {
      if (typeof data[key] !== 'string' || data[key] === '') {
        throw new Error(`Invalid data in ${key}.`)
      }
    })

    if ('link' in data) {
      if (typeof data['link']['href'] !== 'string' || data['link']['href'] === ''
          || typeof data['link']['text'] !== 'string' || data['link']['text'] === '') {
          throw new Error('Invalid data in link.')
      }
    }

    data.pictures.forEach(image => {
      if (!image.startsWith('https://firebasestorage.googleapis.com/v0/b/portfolio-7469a.appspot.com/o/pictures')) {
        throw new Error('Invalid URL in pictures.')
      }
    })
  } catch (err) { // catches missing keys
    apiLog(req, err)
    return false
  }

  return true
}

/**
 * @param {Request} req 
 * @param {String} msg 
 */
function apiLog(req, msg) {
  console.log(`[${req.path}]`, msg)
}

module.exports = {
  isCleanData: isCleanData,
  apiLog: apiLog,
};
