var express = require('express');
var router = express.Router();
let UserModel = require('../schemas/users');

router.get('/', async (req, res) => {
  try {
    let users = await UserModel.find({ isDeleted: false }).populate('role');
    res.status(200).send({ success: true, data: users });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let newUser = new UserModel(req.body);
    let savedUser = await newUser.save();
    res.status(201).send({ success: true, data: savedUser });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).send({ success: false, message: 'User not found' });
    res.status(200).send({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let deletedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedUser) return res.status(404).send({ success: false, message: 'User not found' });
    res.status(200).send({ success: true, data: deletedUser });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.post('/enable', async (req, res) => {
  try {
    let { email, username } = req.body;
    let user = await UserModel.findOne({ email: email, username: username, isDeleted: false });
    if (!user) {
      return res.status(404).send({ success: false, message: 'Invalid email/username or User not found' });
    }
    user.status = true;
    await user.save();
    res.status(200).send({ success: true, message: 'User enabled successfully', data: user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.post('/disable', async (req, res) => {
  try {
    let { email, username } = req.body;
    let user = await UserModel.findOne({ email: email, username: username, isDeleted: false });
    if (!user) {
      return res.status(404).send({ success: false, message: 'Invalid email/username or User not found' });
    }
    user.status = false;
    await user.save();
    res.status(200).send({ success: true, message: 'User disabled successfully', data: user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;
