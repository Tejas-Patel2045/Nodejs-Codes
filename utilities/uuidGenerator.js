const { uuid } = require('uuidv4');
//Function to return uuid
exports.randomId = () => {
    return uuid();
}

