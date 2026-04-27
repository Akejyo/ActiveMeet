import express from 'express';
const router = express.Router();

//* Temporary data
import { sampleUser, samplePosts } from './sampleData.js';
import { checkEmailFieldsOnly, checkPassword } from '../helpers.js';
import { authenticateUser } from '../data/users.js';

router.get('/', (req, res) => {
  res.render('profile/profile', {
    title: 'Profile',
    user: sampleUser,
    posts: samplePosts
  });
});

router.get('/edit', (req, res) => {
  res.render('profile/profileEdit', {
    title: 'Edit Profile',
    user: sampleUser,
    isBeginner: sampleUser.skill === 'Beginner',
    isIntermediate: sampleUser.skill === 'Intermediate',
    isAdvanced: sampleUser.skill === 'Advanced'
  });
});

// login and register
router.route('/login')
.get(async (req, res) => {
  res.render('login', { title: 'Login' });
})
.post(async (req, res) => {
  let { email, password } = req.body
  let message = []
  let error = false
  try{
    email = checkEmailFieldsOnly(email)
  }catch(e){
    message.push(e)
    error = true
  }
  try{
    password = checkPassword(password)
  } catch(e){
    message.push(e)
    error = true
  }
  let prev = {
      email: email,
      password: password
    }
  if(error){
    return res.status(400).render('login', { title: 'Login', error: true, message: message.join('\n'), prev: prev})
  } else{
    try{
      let res2 = await authenticateUser(email, password)
      if (!(typeof res2 == 'object')) throw 'Something went wrong with authentication, possible internal server error'
      req.session.user = {
        _id: res2._id.toString(),
        firstName: res2.firstName,
        lastName: res2.lastName,
        email: res2.email,
        city: res2.city,
        state: res2.state,
        age: res2.age,
        gender: res2.gender,
        bio: res2.bio,
        sportsInterests: res2.sportsInterests,
        folowerNumber: res2.followerIds.length,
        followingNumber: res2.followingIds.length,
        createdPostIds: res2.createdPostIds,
        joinedPostIds: res2.joinedPostIds,
        blockedUserIds: res2.blockedUserIds,
        visibility: res2.visibility,
        skill: res2.skill
      }
      return res.redirect('/profile')
    }catch(e){
      return res.status(400).render('login', { title: 'Login', error: true, message: e, prev: prev})
    }
  }
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.get('/interest-setup', (req, res) => {
    res.render('interestSetup', { title: 'Interest Setup' });
});

export default router;