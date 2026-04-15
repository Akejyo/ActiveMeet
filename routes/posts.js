import express from 'express';
const router = express.Router();

//* Temporary data
import { samplePosts } from './sampleData.js';
// TODO: Now is temporary route, need POST and other motifies.

router.get('/create', (req, res) => {
  res.render('post/postCreate', { title: 'Create Post' });
});


router.get('/:id', (req, res) => {
  const postId = req.params.id;
  res.render('post/postDetail', {
    title: 'Post Detail',
    post: samplePosts.find(p => p.id === parseInt(postId)),
    comments: []
  });
});

router.get('/:id/edit', (req, res) => {
    const postId = req.params.id;
    res.render('post/postEdit', {
        title: 'Edit Post',
        post: samplePosts.find(p => p.id === parseInt(postId))
    });
});

export default router;