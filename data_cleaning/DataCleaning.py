import pandas as pd
from collections import defaultdict
import math

file1 = "../raw-data/Average_daily_income_per_capita_PPP.csv"
file2 = "../raw-data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv"
file3 = "../raw-data/GDP_total_yearly_growth.csv"
file4 = "../raw-data/aid_received_per_person_current_us.csv"
file5 = "../raw-data/Market_value_of_listed_companies_percent_of_GDP.csv"
#Birth-rate, C02, dath rate, population, gdp

properties = [
    "average_daily_income_per_capita",
    "income_per_person_gdppercapita",
    "gdp_total",
    "aid_received_per_person",
    "market_value_of_listed_companies"
]

saveFileAddress = "../cleaned_data/processed_data.csv"

CountriesToKeep = {'Canada', 'France', 'United States', 'United Kingdom'}

YearRange = [1991, 2010]

########################################################################################
def convertStrToNumber(x):
    total_stars = 0
    num_map = {'K':1000, 'M':1000000, 'B':1000000000}
    if x.isdigit():
        total_stars = int(x)
    else:
        if len(x) > 1:
            total_stars = float(x[:-1]) * num_map.get(x[-1].upper(), 1)
    return int(total_stars)

def getFloatValue(floatString):
    try:
        return float(str(floatString).encode("ascii","ignore").decode("ascii"))
    except Exception as err:
        return float(convertStrToNumber(floatString))

def loadFile(fileAddress, data, yearMin, yearMax):
    rawDataFrame = pd.read_csv(fileAddress, index_col=0, encoding= 'unicode_escape')
    for countryName, row in rawDataFrame.iterrows():
        #if countryName not in CountriesToKeep:  #Skip other countries
        #    continue
        try:
            if countryName not in data: data[countryName] = defaultdict(list)
            columnList = [int(i) for i in rawDataFrame.columns.to_list()]
            for year in columnList:
                if yearMin<=year and year<=yearMax:
                    try:
                        value = getFloatValue(row[str(year)])
                        if not math.isnan(value):
                            data[countryName][year].append(value)
                        #else:
                        #    value = getFloatValue(row[str(year)])
                    except Exception as err:
                        print(err)
        except Exception as err:
            print("Parse file error : ", err)
    return data

def saveFile(data, fileAddress = saveFileAddress):
    df = pd.DataFrame(columns=['country','year'])
    #df = df.append({'a':1, 'b':2}, ignore_index=True)
    for country in data:
        for year in data[country]:
            a = data[country][year]
            df = df.append({
                        'country':country,
                        'year':int(year),
                        properties[0]:data[country][year][0],
                        properties[1]:data[country][year][1],
                        properties[2]:data[country][year][2],
                        properties[3]:data[country][year][3],
                        properties[4]:data[country][year][4]
                     }, ignore_index=True)
    df.to_csv (fileAddress, index = None, header=True)
    print("File Save Completed")

def checkIfEachElementOk(dictionary, minNoOfProperty):
    keys = dictionary.keys()
    for key in keys:
        if len(dictionary[key])<minNoOfProperty:
            return False
    return True

def filterData(dictionary, minNoOfProperty = 5):
    keys = list(dictionary.keys())
    for key in keys:
        if not checkIfEachElementOk(dictionary[key], minNoOfProperty):
            del dictionary[key]
            #print(key)
    return data

data = defaultdict(str)
data = loadFile(file1, data, YearRange[0], YearRange[1])
data = loadFile(file2, data, YearRange[0], YearRange[1])
data = loadFile(file3, data, YearRange[0], YearRange[1])
data = loadFile(file4, data, YearRange[0], YearRange[1])
data = loadFile(file5, data, YearRange[0], YearRange[1])
data = filterData(data,5)

saveFile(data)
