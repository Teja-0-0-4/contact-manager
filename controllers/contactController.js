const asyncHandler = require("express-async-handler");
const  Contact = require("../models/contactModel");
//@desc Get all Contacts
//@route GET/api/contacts
//@access private

const getContacts = asyncHandler(async(req,res)=>{
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

//@desc Create  New Contacts
//@route POST/api/contacts
//@access private

const createContact = asyncHandler(async(req,res)=>{
    console.log("The req body is",req.body);
    const{name,email,phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are required");
    }
    try {
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id
        });
        res.status(201).json(contact);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Server error" });
    }    
});

//@desc Get Contact
//@route GET/api/contacts/:id
//@access private

const getContact = asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found"); 
    }
    res.status(200).json(contact);
});
//@desc update Contact
//@route PUT/api/contacts/:od
//@access private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permisson to update other user contacts");
    } 
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedContact);
});


//@desc Delete COntact
//@route DELETE/api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
    console.log("Finding contact with ID:", req.params.id);
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        console.log("Contact not found");
        res.status(404);
        throw new Error("Contact not found");
    }

    console.log("Contact found. User ID:", contact.user_id, "Request User ID:", req.user.id);

    if (contact.user_id.toString() !== req.user.id) {
        console.log("Unauthorized attempt to delete contact");
        res.status(403);
        throw new Error("User does not have permission to delete this contact");
    }

    console.log("Deleting contact...");
    await Contact.findByIdAndDelete(req.params.id);

    console.log("Contact deleted successfully");
    res.status(200).json({ message: "Contact deleted successfully" });
});


module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};