import express from 'express';
const router = express.Router();

import { sampleUser, samplePosts } from './sampleData.js';

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    user: sampleUser,
    posts: samplePosts
  });
});

export default router;