const Country = require('../../../models/Country');
const db = require('../../../db/connect');

describe('Country', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe('getAll', () => {
    it('resolves with countries array on successful db query', async () => {
      // Arrange
      const mockCountries = [
        {
          country_id: 1,
          name: 'Country1',
          capital: 'Capital1',
          population: 100,
          languages: 'lang1',
          fun_facts: 'Fun-fact-1',
          map_image_url: 'image-url-1',
        },
        {
          country_id: 2,
          name: 'Country2',
          capital: 'Capital2',
          population: 200,
          languages: 'lang2',
          fun_facts: 'Fun-fact-2',
          map_image_url: 'image-url-2',
        },
      ];
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockCountries });

      // Act
      const countries = await Country.getAll();

      // Assert
      expect(countries).toHaveLength(2);
      expect(countries[0]).toHaveProperty('country_id');
      expect(countries[0].name).toBe('Country1');
      expect(db.query).toHaveBeenCalledWith('SELECT name FROM country;');
    });

    it('should throw an Error when no countries are found', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      await expect(Country.getAll()).rejects.toThrow('No countries available.');
    });
  });

  describe('findByName', () => {
    it('resolves with country on successful db query', async () => {
      // Arrange
      const testCountry = {
        country_id: 1,
        name: 'Country1',
        capital: 'Capital1',
        population: 100,
        languages: 'lang1',
        fun_facts: 'Fun-fact-1',
        map_image_url: 'image-url-1',
      };

      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [testCountry] });

      // Act
      const result = await Country.findByName(testCountry.name);

      // Assert
      expect(result).toBeInstanceOf(Country);
      expect(result.name).toBe(testCountry.name);
      expect(result.country_id).toBe(1);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM country WHERE LOWER(name) = LOWER($1);',
        [testCountry.name]
      );
    });

    it('should throw an Error when country is not found', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      await expect(Country.findByName('NoCountry')).rejects.toThrow(
        'Unable to locate country.'
      );
    });
  });

  describe('create', () => {
    it('resolves with country on successful creation', async () => {
      // Arrange
      const testCountry = {
        name: 'Country1',
        capital: 'Capital1',
        population: 100,
        languages: 'lang1',
      };

      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      jest
        .spyOn(db, 'query')
        .mockResolvedValueOnce({ rows: [{ ...testCountry, country_id: 1 }] });

      // Act
      const result = await Country.create(testCountry);

      // Assert
      expect(result).toBeInstanceOf(Country);
      expect(result).toHaveProperty('country_id', 1);
      expect(result).toHaveProperty('name', 'Country1');
      expect(result).toHaveProperty('capital', 'Capital1');
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO country (name, capital, population, languages) VALUES ($1, $2, $3, $4) RETURNING *;',
        [
          testCountry.name,
          testCountry.capital,
          testCountry.population,
          testCountry.languages,
        ]
      );
    });

    it('should throw an Error when name is missing', async () => {
      // Arrange
      const incompleteData = {
        capital: 'Capital1',
        population: 100,
        languages: 'lang1',
      };

      // Act & Assert
      await expect(Country.create(incompleteData)).rejects.toThrow(
        'Incomplete data type.'
      );
    });

    it('should throw an Error when country is already present', async () => {
      // Arrange
      const testCountry = {
        name: 'Country1',
        capital: 'Capital1',
        population: 100,
        languages: 'lang1',
      };

      // Assert
      await expect(Country.create(testCountry)).rejects.toThrow(
        'A country with this name already exists.'
      );
    });
  });

  describe('update', () => {
    const country = new Country({
      country_id: 1,
      name: 'Country1',
      capital: 'Capital1',
      population: 100,
      languages: 'lang1',
      fun_facts: 'Fun-fact-1',
      map_image_url: 'image-url-1',
    });

    it('should return the updated country on successful update', async () => {
      // Arrange
      const updateData = { capital: 'NewCapital' };

      const updatedCountry = {
        country_id: 1,
        name: 'Country1',
        population: 100,
        languages: 'lang1',
        fun_facts: 'Fun-fact-1',
        map_image_url: 'image-url-1',
        capital: updateData.capital,
      };

      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedCountry] });

      // Act
      const result = await country.update(updateData);

      // Assert
      expect(result).toBeInstanceOf(Country);
      expect(result.country_id).toBe(1);
      expect(result.capital).toBe('NewCapital');
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE country SET capital = $1 WHERE LOWER(name) = LOWER($2) RETURNING name, capital;',
        [updateData.capital, country.name]
      );
    });

    it('should throw an Error on db query failure', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(country.update({ capital: 'Capital' })).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('destroy', () => {
    const country = new Country({
      country_id: 1,
      name: 'Country1',
      capital: 'Capital1',
      population: 100,
      languages: 'lang1',
      fun_facts: 'Fun-fact-1',
      map_image_url: 'image-url-1',
    });

    it('should return the deleted country on successful deletion', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [country] });

      // Act
      const result = await country.destroy();

      // Assert
      expect(result).toBeInstanceOf(Country);
      expect(result.country_id).toBe(1);
      expect(result.name).toBe('Country1');
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM country WHERE name = $1 RETURNING *;',
        [country.name]
      );
    });

    it('should throw an Error on db query failure', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(country.destroy()).rejects.toThrow('Database error');
    });
  });
});
