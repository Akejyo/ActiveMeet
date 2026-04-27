import express from 'express';
const router = express.Router();

import { sampleUser, samplePosts } from './sampleData.js';

router.get('/', (req, res) => { //set logedIn to true if user is logged in, false otherwise
  res.render('home', {
    title: 'Home',
    user: sampleUser,
    posts: samplePosts
  });
});

export default router;