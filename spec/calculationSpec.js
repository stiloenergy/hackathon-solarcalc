describe('sunCalculator', function () {

  var calculator;

  describe('calculateKWP', function () {

    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should return undefined for no input', function () {
      expect(calculator.calculateKWP(undefined)).toBeUndefined();
    });

    it('should return 0.11765 KWp for 1 sqm', function () {
      expect(calculator.calculateKWP(1)).toEqual(0.15);
    });

    it('should return 0.23529 KWp for 2 sqm', function () {
      expect(calculator.calculateKWP(2)).toEqual(0.30);
    });

    it('should return 1 KWp for 8.5 sqm', function () {
      expect(calculator.calculateKWP(10)).toEqual(1.50);
    });
  });

  describe('calculateSubsidy', function () {

    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should return 70.88 Euro for 1 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(1, 'Baden-Wurttemberg', 0)).toBe(70.88);
    });

    it('should return 206.82 Euro for 2 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(2, 'Baden-Wurttemberg', 0)).toBe(206.82);
    });

    it('should return 1294.3 Euro for 10 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(10, 'Baden-Wurttemberg', 0)).toBe(1294.3);
    });

    it('should return 1423.25 Euro for 11 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(11, 'Baden-Wurttemberg', 0)).toBe(1423.25);
    });

    it('should return 7334.24 Euro for 60 KWP in Baden-Wuerttemberg', function () {
      calculator.setPeople(1);
      expect(calculator.calculateSubsidy(60, 'Baden-Wurttemberg', 0)).toBe(7334.24);
    });

    it('should return 8800.91 Euro for 80 KWP in Sachsen', function () {
      expect(calculator.calculateSubsidy(80, 'Saxony', 0)).toBe(8800.91);
    });
  });

  describe('adjustSubsidies', function () {

    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should not adjust the subsidies for current month', function () {
      var adjustedSubsidies = {'small': 13.01, 'medium': 12.34, 'large': 11.01};

      calculator.adjustSubsidies(new Date(2014, 5, 14), new Date(2014, 5, 14));

      expect(calculator.getSubsidies()).toEqual(adjustedSubsidies);
    });

    it('should adjust the subsidies for 2 months in future', function () {
      var adjustedSubsidies = {'small': 12.75, 'medium': 12.09, 'large': 10.79};

      calculator.adjustSubsidies(new Date(2014, 5, 14), new Date(2014, 7, 14));

      expect(calculator.getSubsidies()).toEqual(adjustedSubsidies);
    });

    it('should adjust the subsidies for 9 months in future', function () {
      var adjustedSubsidies = {'small': 11.88, 'medium': 11.27, 'large': 10.06};

      calculator.adjustSubsidies(new Date(2014, 5, 14), new Date(2015, 2, 14));

      expect(calculator.getSubsidies()).toEqual(adjustedSubsidies);
    });
  });

  describe('adjustForOwnEnergyConsumption', function () {

    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should return 6943.09 Euro for 60 KWP in BW', function () {
      calculator.setPeople(4);

      expect(calculator.calculateSubsidy(60, 'Baden-Wurttemberg', 0)).toBe(6943.09);
    });
  });

  describe('calculateAcquisitionCosts', function () {

    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should return undefined for no KWP', function () {
      expect(calculator.calculateAcquisitionCosts(undefined)).toBe(undefined);
    });

    it('should return 1500.00 Euro for 1 KWP (HOME)', function () {
      expect(calculator.calculateAcquisitionCosts(1, 'HOME')).toBe(1500.00);
    });

    it('should return 15000.00 Euro for 10 KWP (HOME)', function () {
      expect(calculator.calculateAcquisitionCosts(10, 'HOME')).toBe(15000.00);
    });

    it('should return 1600.00 Euro for 1 KWP (FIELD)', function () {
      expect(calculator.calculateAcquisitionCosts(1, 'FIELD')).toBe(1600.00);
    });

    it('should return 16000.00 Euro for 10 KWP (FIELD)', function () {
      expect(calculator.calculateAcquisitionCosts(10, 'FIELD')).toBe(16000.00);
    });
  });

  describe('calculateAmortization()', function () {
    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should return object including all needed data', function () {
      calculator.setPeople(1);
      expect(calculator.calculateAmortization(90000.00, 5762.14)).toEqual(15);
    });
  });

  describe('calculateSolarCap()', function () {
    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should return object including all needed data (4 persons)', function () {
      calculator.setBattery(true);

      var returnObject = {
        yearlySubsidy: 6943.09,
        acquisitionCosts: 104000.00,
        CO2Savings: 43762.87,
        savingFromBattery: 208.78,
        amortizationInYears: 14,
        KWHPerYear: 62518.38,
        yearlySavings: 432.74,
        yearlyMoney: 7375.83,
        error: undefined
      };

      expect(calculator.calculateSolarCap(400, 'Baden-Wurttemberg', 4, 'HOME')).toEqual(returnObject);
    });

    it('should return object including all needed data (1 person)', function () {
      calculator.setBattery(true);

      var returnObject = {
        yearlySubsidy: 7334.24,
        acquisitionCosts: 100000.00,
        savingFromBattery: 52.20,
        CO2Savings: 43762.87,
        amortizationInYears: 13,
        KWHPerYear: 62518.38,
        yearlySavings: 108.19,
        yearlyMoney: 7442.43,
        error: undefined
      };

      expect(calculator.calculateSolarCap(400, 'Baden-Wurttemberg', 1, 'HOME')).toEqual(returnObject);
    });

    it('should return object with error if sqm is missing', function () {
      expect(calculator.calculateSolarCap(undefined, 'Baden-Wurttemberg', 4, 'HOME').error).toEqual('argument missing');
    });

    it('should render error when yearly subsidy is negative', function () {
      var returnObject = {
        yearlySubsidy: 0,
        acquisitionCosts: 0,
        savingFromBattery: 0,
        CO2Savings: 0,
        amortizationInYears: 0,
        KWHPerYear: 0,
        yearlySavings: 0,
        yearlyMoney: 0,
        error: 'negative subsidy'
      };

      expect(calculator.calculateSolarCap(10, 'Baden-Wurttemberg', 5, 'HOME')).toEqual(returnObject);
    });
  });

  describe('calculateCO2Savings', function () {
    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should save 7178.83 KG CO2 per year for a 10 KWP plant in Bavaria', function () {
      expect(calculator.calculateCO2Savings(10, 'Bavaria')).toEqual(7178.83);
    })
  });

  describe('calculateYearlySavings', function () {
    beforeEach(function () {
      calculator = sunCalculator();
    });

    it('should show for 5 people', function () {
      calculator.setPeople(5);
      expect(calculator.calculateYearlySavings()).toEqual(279.95);
    })
  });
});