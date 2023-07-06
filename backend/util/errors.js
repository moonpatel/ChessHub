class NotFoundError {
    constructor(message) {
        this.message = message;
        this.status = 404;
    }
}

class NotAuthError {
    constructor(message) {
        this.message = message;
        this.status = 401;
    }
}

function catchAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}

exports.NotFoundError = NotFoundError;
exports.NotAuthError = NotAuthError;
exports.catchAsync = catchAsync