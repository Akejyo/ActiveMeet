import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('report', { title: 'Report' });
});

export default router;