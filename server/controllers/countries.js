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
    console.log('PARAMS: ', name);
    const country = await Country.findByName(name);
    res.status(200).json({ success: true, data: country });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const data = req.body;
    const newCountry = await Country.create(data);
    res.status(201).json({ success: true, data: newCountry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const name = req.params.name;
    const data = req.body;
    const country = await Country.findByName(name);
    const result = await country.update(data);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function destroy(req, res) {
  try {
    const name = req.params.name;
    const country = await Country.findByName(name);
    const result = await country.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
