const Country = require('../models/Country');

async function index(req, res) {
  try {
    const countries = await Country.getAll();
    res.status(200).json({ success: true, data: countries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function show(req, res) {
  try {
    let name = req.params.name;
    const country = await Country.findByName(name);
    res.status(200).json({ success: true, data: country });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  index,
  show,
};
