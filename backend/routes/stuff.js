const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');
// ajouter auth, lorsque route a protéger
router.get('/', stuffCtrl.getAllBook);
router.get('/:id', stuffCtrl.getOneBook);
router.get('/bestrating', stuffCtrl.topThree);
router.post('/', auth, multer, stuffCtrl.createBook);
router.put('/:id', auth, multer, stuffCtrl.modifyBook);
router.post('/:id/rating', auth, stuffCtrl.rateBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);



module.exports = router;