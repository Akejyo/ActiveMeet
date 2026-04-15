import express from 'express';
const router = express.Router();

//* Temporary data
import { sampleUser } from './sampleData.js';

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
    user: sampleUser
  });
});

// login and register
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.get('/interest-setup', (req, res) => {
    res.render('interestSetup', { title: 'Interest Setup' });
});

export default router;