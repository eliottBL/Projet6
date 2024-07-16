const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');
// ajouter auth, lorsque route a protéger
router.get('/', stuffCtrl.getAllStuff);
router.get('/:id', stuffCtrl.getOneThing);
//get bestrating
router.post('/', auth, stuffCtrl.createThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

router.post('/:id/rating', auth, stuffCtrl.rate);

module.exports = router;