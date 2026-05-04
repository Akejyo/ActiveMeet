import express from 'express';
const router = express.Router();

router.get('/', (req, res) => { //TODO both get and post routes
    res.render('report', { title: 'Report' });
});

export default router;