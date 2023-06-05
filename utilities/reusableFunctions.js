const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const saltRound = 10

const iv = crypto.randomBytes(16);
exports.CreateOrUpdate = (values, condition, Model) => {
    return Model
        .findOne({ where: condition })
        .then(function (obj) {
            // update
            if (obj)
                return obj.update(values);
            // insert
            return Model.create(values);
        })
}

//encryptanddecrypt functions start
exports.encrypt = function (text) {
    var cipher = crypto.createCipheriv(algorithm, secretKey,iv);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted.toString('hex');
}

exports.decrypt = function (text) {
    var cipherkey = key;
    var decipher = crypto.createDecipheriv(algorithm, cipherkey,iv);
    var decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString();
}
//encryptanddecrypt functions end

exports.hashPassword = function (plainTextPassword) {
    let salt = bcrypt.genSaltSync(saltRound)
    let hash = bcrypt.hashSync(plainTextPassword, salt)
    return hash
}
//encryptanddecrypt functions end


exports.comparePassord = function (textPassword, hashPassword){
    let compare = bcrypt.compareSync(textPassword, hashPassword)
    console.log(compare);
    return compare
}

exports.distance = function(lat1,lat2, lon1, lon2)
{

// The math module contains a function
// named toRadians which converts from
// degrees to radians.
lon1 =  lon1 * Math.PI / 180;
lon2 = lon2 * Math.PI / 180;
lat1 = lat1 * Math.PI / 180;
lat2 = lat2 * Math.PI / 180;

// Haversine formula
let dlon = lon2 - lon1;
let dlat = lat2 - lat1;
let a = Math.pow(Math.sin(dlat / 2), 2)
+ Math.cos(lat1) * Math.cos(lat2)
* Math.pow(Math.sin(dlon / 2),2);

let c = 2 * Math.asin(Math.sqrt(a));

// Radius of earth in kilometers. Use 3956
// for miles
let r = 6371;

// calculate the result
return (c * r)
}


exports.randomAlphaNumaric = function(len,arr)
{
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += 
          arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}