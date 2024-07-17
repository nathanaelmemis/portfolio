function success(res, data=null) {
    if (data) {
        res.status(200).json({
            message: 'Success.',
            data: data
        })
    } else {
        res.status(200).json({
            message: 'Success.'
        })
    }
}

function invalidData(res) {
    res.status(400).json({
        message: 'Invalid data.'
    })
}

function failedLogin(res, message='Failed Login.') {
    res.status(400).json({
        message: message
    })
}

function internalServerErrorOccured(res) {
    res.status(500).json({
        message: 'An internal server error occured.'
    })
}

module.exports = {
    success: success,
    invalidData: invalidData,
    failedLogin: failedLogin,
    internalServerErrorOccured: internalServerErrorOccured
}