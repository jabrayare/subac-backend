const jwt = require('jsonwebtoken');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.status(403).json({ message: 'Unauthorized user', Error: err });
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);

    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    if (!result) return res.status(403).json({ message: 'Unauthorized user', Error: err });
    next();
  }
}

  module.exports = verifyRoles;