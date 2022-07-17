const express = require('express');
const {check} = require('express-validator');

const router = express.Router();
const dashboardControllers = require('../controllers/dashboard-controller');
const checkAuth = require('../middleware/check-auth');

router.get('/:uid', dashboardControllers.getAnimesByUserId);
router.get('/:uid/:title', dashboardControllers.getAnimesByTitle);

router.use(checkAuth);
router.post(
    '/:uid', 
    [
        check('title').not().isEmpty(),
        check('images.jpg.image_url').not().isEmpty()
    ],
dashboardControllers.addAnime);
router.delete('/:uid/:aid', dashboardControllers.deleteAnime);
module.exports = router;