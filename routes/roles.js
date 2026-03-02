var express = require('express');
var router = express.Router();
let RoleModel = require('../schemas/roles');

router.get('/', async (req, res) => {
    try {
        let roles = await RoleModel.find({ isDeleted: false });
        res.status(200).send({ success: true, data: roles });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let role = await RoleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).send({ success: false, message: 'Role not found' });
        res.status(200).send({ success: true, data: role });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let newRole = new RoleModel(req.body);
        let savedRole = await newRole.save();
        res.status(201).send({ success: true, data: savedRole });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        let updatedRole = await RoleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedRole) return res.status(404).send({ success: false, message: 'Role not found' });
        res.status(200).send({ success: true, data: updatedRole });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let deletedRole = await RoleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) return res.status(404).send({ success: false, message: 'Role not found' });
        res.status(200).send({ success: true, data: deletedRole });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

module.exports = router;
