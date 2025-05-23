const db = require('../db/connect');

class Country {
  constructor({
    country_id,
    name,
    capital,
    population,
    languages,
    fun_fact,
    map_image_url,
  }) {
    this.country_id = country_id;
    this.name = name;
    this.capital = capital;
    this.population = population;
    this.languages = languages;
    this.fun_fact = fun_fact;
    this.map_image_url = map_image_url;
  }

  static async getAll() {
    const response = await db.query('SELECT name FROM country;');

    if (response.rows.length === 0) {
      throw new Error('No countries available.');
    }
    return response.rows.map(c => new Country(c));
  }

  static async findByName(name) {
    const response = await db.query(
      'SELECT * FROM country WHERE LOWER(name) = LOWER($1);',
      [name]
    );

    if (response.rows.length !== 1) {
      throw new Error('Unable to locate country.');
    }

    return new Country(response.rows[0]);
  }

  static async create(data) {
    const { name, capital, population, languages } = data;

    if (!name || !capital || !population || !languages) {
      throw new Error('Incomplete data type.');
    }

    const existingCountry = await db.query(
      'SELECT name FROM country WHERE LOWER(name) = LOWER($1);',
      [name]
    );

    if (existingCountry.rows.length === 0) {
      const response = await db.query(
        'INSERT INTO country (name, capital, population, languages) VALUES ($1, $2, $3, $4) RETURNING *;',
        [name, capital, population, languages]
      );

      return new Country(response.rows[0]);
    } else {
      throw new Error('A country with this name already exists.');
    }
  }

  async update(data) {
    const response = await db.query(
      'UPDATE country SET capital = $1 WHERE LOWER(name) = LOWER($2) RETURNING name, capital;',
      [data.capital, this.name]
    );

    if (response.rows.length !== 1) {
      throw new Error('Unable to update capital.');
    }

    return new Country(response.rows[0]);
  }

  async destroy() {
    const response = await db.query(
      'DELETE FROM country WHERE name = $1 RETURNING *;',
      [this.name]
    );

    return new Country(response.rows[0]);
  }
}

module.exports = Country;
