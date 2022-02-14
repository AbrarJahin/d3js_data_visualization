//export 
class Data {
	// this.aid_received_per_person
	// this.average-daily-income-per-capita
	// this.country
	// this.gdp-total
	// this.income_per_person_gdppercapita
	// this.market-value-of-listed-companies
	// this.year

	constructor(country, year, prop0, prop1, prop2, prop3, prop4) {
		this.country = country;
		this.year = year;

		this.prop0 = prop0;
		this.prop1 = prop1;
		this.prop2 = prop2;
		this.prop3 = prop3;
		this.prop4 = prop4;
	}
	// Getter
	get to_string() {
		return this.getString();
	}
	// Method
	getString() {
		return str(this.country) + "-" + str(this.year);
	}
}

//const square = new Rectangle(10, 10);