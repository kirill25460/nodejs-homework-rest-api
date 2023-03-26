const {HttpError, ctrlWrapper} = require("../helpers");
const {Contact} = require("../models/contact")


  const listContacts = async (req, res, next) => {
      const {_id: owner} = req.user;
    const result = await Contact.find({owner});
    res.json(result); 
  }


  const getContactById = async (req, res, next) => {
    const { _id } = req.user;
    const { contactId } = req.params;
    const contact = await Contact.findOne({ _id: contactId, owner: _id });
    if (!contact) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      data: { result: contact },
    });
    }
    

  const addContact = async (req, res, next) => {
      const {id: owner} = req.user;
       const result = await Contact.create({...req.body, owner});
       res.status(201).json(result);
   }

   const removeContact = async (req, res, next) => {
    const { _id } = req.user;
    const { contactId } = req.params;
    const contact = await Contact.deleteOne({ _id: contactId, owner: _id });
    if (!contact) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
      data: contact,
    });
  }


   const updateFavorite = async (req, res) =>{
    const { _id } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findOneAndUpdate({ _id: contactId, owner: _id }, { $set: req.body });
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json({
      status: 'success',
      code: 201,
      data: { result },
    });
   }

  const updateContact = async (req, res, next) => {
    const { _id } = req.user;
    const { contactId } = req.params;
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, 'missing fields');
    }
    const result = await Contact.findOneAndUpdate({ _id: contactId, owner: _id }, { $set: req.body });
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json({
      status: 'success',
      code: 201,
      data: { result },
    });
  }

  module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite)
}
