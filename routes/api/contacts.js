const express = require('express');
const router = express.Router();
const ctrl = require("../../controllers/contacts");

const {isValidId} = require("../../middlewares");
const {authenticate} = require("../../middlewares")


router.get('/', authenticate, ctrl.listContacts);

router.get('/:contactId', authenticate, isValidId,  ctrl.getContactById);

router.post('/', authenticate, ctrl.addContact);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact);

router.put('/:contactId', authenticate, isValidId, ctrl.updateContact);

router.patch('/:contactId/favorite', authenticate, isValidId,  ctrl.updateFavorite);





module.exports = router;
