const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  var token = req.get("Authorization").split(" ")[1];
  console.log(token)
  var decodeToken;
  try {
    decodeToken = jwt.verify(token, "thiIsTestJsonToken")
    console.log('decodeToken', decodeToken)
  } catch (error) {
      console.log(error);
  }
  if(!decodeToken){
    res.status(401).json('Unauthorized!');
  }
  next(decodeToken);
};
