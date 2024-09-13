const express = require('express');
const router = express.Router();

const Admin = require('../../../models/Admin');
const fetchAdmin = require('../../../middleware/fetchAdmin');

// ROUTE 1: Get loggedIn admin details using GET "/api/getData/admin/adminData/fetchData"

router.get('/fetchData', fetchAdmin, async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await Admin.findById(adminId).select('-password');
    res.json(admin);
  } catch (err) {
    // console.log(err);
    res.status(400).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
