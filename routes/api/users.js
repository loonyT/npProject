const express = require('express');
const router = express.Router(); //using the express routeur 
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs'); //to salt the password
const jwt = require('jsonwebtoken'); //bringing in the json web token 
const config = require('config'); //call default.json
const {
  check,
  validationResult
} = require('express-validator/check'); //you can check the documentation for further explainations
// if there is an error, you wanna sent a response so you add a second param 
const normalize = require('normalize-url');

const User = require('../../models/User');






// @route    POST api/users
// @desc     Register user
// @access   Public does not need a road
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(), // not and empty are the rules to check for not empty
    check('email', 'Please include a valid email').isEmail(), //make sure is an actual valid email adress
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6 //six or more characs and the rule is lenght 
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { //checking for errors
      return res.status(400).json({ //if informations are not included correctly then its a bad request
        errors: errors.array() //here we use an array method and send that back in json 
      });
    }
    // we can handle the express validator in the front end with react, as we want. 
    const {
      name,
      email,
      password
    } = req.body; //that will pull that stuff out

    try {
      let user = await User.findOne({ //Gives us a promise back 
        email //will get the user
      });

      if (user) {
        return res
          .status(400) //bad request 
          .json({
            errors: [{
              msg: 'User already exists'
            }]
          });
      }

      const avatar = normalize(
        gravatar.url(email, { //passing three options : s is default size, r is the rating, and d is default mm gives you a default image like a user icon
          s: '200',
          r: 'pg',
          d: 'mm'
        }), {
          forceHttps: true
        }
      );

      user = new User({ //creating an instance of the user and we pass an object to it 
        name,
        email,
        avatar,
        password
      });
      //crypting the pwd 
      const salt = await bcrypt.genSalt(10); //doing the hashing 10 is whats recomended in the documentation

      user.password = await bcrypt.hash(password, salt);



      await user.save(); //await since its returning a promise 

      const payload = { // we are creating an object 
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'), { //we want to get the jwt token 
          expiresIn: '5 days' //how much time does the token stay valid ? 
        },
        (err, token) => { //callback function that checks for the error
          if (err) throw err;
          res.json({
            token // its the data we wanna send 
          });
        }
      );
    } catch (err) { //if smtg goes wrong its probably a server error that will be checked here
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; //exportation of the routeur