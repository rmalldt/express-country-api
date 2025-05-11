const countryController = require('../../../controllers/countries');
const Country = require('../../../models/Country');

// Mocking response methods
const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}));

const mockRes = { status: mockStatus };

describe('Country controller', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe('index', () => {
    it('should return countries with a status code 200', async () => {
      // Arrange
      const countries = [{ name: 'Country1' }, { name: 'Country2' }];
      jest.spyOn(Country, 'getAll').mockResolvedValue(countries);

      await countryController.index(null, mockRes);

      expect(Country.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ success: true, data: countries });
    });

    it('should return an error upon failure', async () => {
      jest.spyOn(Country, 'getAll').mockRejectedValue(new Error('Db Error'));

      await countryController.index(null, mockRes);

      expect(Country.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Db Error',
      });
    });
  });

  describe('show', () => {
    let testCountry, mockReq;

    beforeEach(() => {
      testCountry = {
        country_id: 1,
        name: 'Country1',
        capital: 'Capital1',
        population: 100,
        languages: 'lang1',
        fun_facts: 'Fun-fact-1',
        map_image_url: 'image-url-1',
      };

      mockReq = { params: { name: 'Country1' } };
    });

    it('should return a country with a 200 status code', async () => {
      jest
        .spyOn(Country, 'findByName')
        .mockResolvedValue(new Country(testCountry));

      await countryController.show(mockReq, mockRes);

      expect(Country.findByName).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: new Country(testCountry),
      });
    });

    it('should return an error if the country is not found', async () => {
      jest
        .spyOn(Country, 'findByName')
        .mockRejectedValue(new Error('Db Error'));

      await countryController.show(mockReq, mockRes);

      expect(Country.findByName).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Db Error' });
    });
  });

  describe('create', () => {
    const testCountry = {
      country_id: 1,
      name: 'Country1',
      capital: 'Capital1',
      population: 100,
      languages: 'lang1',
      fun_facts: 'Fun-fact-1',
      map_image_url: 'image-url-1',
    };

    it('should return a new country with a 201 status code', async () => {
      const mockReq = { body: testCountry };
      jest.spyOn(Country, 'create').mockResolvedValue(new Country(testCountry));

      await countryController.create(mockReq, mockRes);

      expect(Country.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: new Country(testCountry),
      });
    });

    it('should return an error if creation fails', async () => {
      const mockReq = { body: testCountry };

      jest.spyOn(Country, 'create').mockRejectedValue(new Error('Db Error'));

      await countryController.create(mockReq, mockRes);

      expect(Country.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Db Error' });
    });
  });
});
