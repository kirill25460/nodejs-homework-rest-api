const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).required();

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone");

const updateSchemaStatus = Joi.object({
  favorite: Joi.boolean().required(),
}).required();

const validator = (schema, message) => (req, res, next) => {
  const body = req.body;
  console.log("body", body);
  const validation = schema.validate(body);

  if (validation.error) {
    res.status(400).json({ message });
    return;
  }

  return next();
};

router.get("/", async (req, res, next) => {
  const allContacts = await listContacts();
  res.set("Content-Type", "application/json").send(allContacts);
  
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({ contact });
});

router.post(
  "/",
  validator(createSchema, "missing required name field"),
  async (req, res, next) => {
    const contact = req.body;

    res.status(201).json(await addContact(contact));
  }
);

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const isRemoveContact = await removeContact(contactId);
  if (!isRemoveContact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(201).json({ message: "contact deleted" });
});

router.put(
  "/:contactId",
  validator(updateSchema, "missing fields"),
  async (req, res, next) => {
    const contactId = req.params.contactId;
    const contact = await updateContact(contactId, req.body);
    if (contact !== null) {
      res.json(contact);
      return;
    }
    res.status(404).json({ message: "Not found" });
  }
);
router.patch(
  "/:contactId/favorite",
  validator(updateSchemaStatus, "missing field favorite"),
  async (req, res, next) => {
    const contactId = req.params.contactId;
    const contact = await updateContact(contactId, req.body);
    if (contact !== null) {
      res.json(contact);
      return;
    }
    res.status(404).json({ message: "Not found" });
  }
);

module.exports = router;