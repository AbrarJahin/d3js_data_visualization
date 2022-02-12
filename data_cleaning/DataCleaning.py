import pandas as pd
from collections import defaultdict

file1 = "../raw-data/Average-daily-income-per-capita,-PPP(constant-2011-international-$).csv"
#file2 = "../raw-data/central_bank_discount_rate_annual_percent.csv"
file3 = "../raw-data/GDP-capita growth-over-next-10-years.csv"
file4 = "../raw-data/GDP-total,-yearly growth.csv"
file5 = "../raw-data/GDP-working-hour-(US$,-inflation-adjusted).csv"
file6 = "../raw-data/Market-value-of-listed-companies-(%-of-GDP).csv"

CountriesToKeep = ['Canada', 'France', 'United States', 'United Kingdom']

YearRange = [1980, 2000]

########################################################################################

def loadFile(fileAddress, data, yearMin, yearMax):
    rawDataFrame = pd.read_csv(fileAddress, index_col=0, encoding= 'unicode_escape')
    for countryName, row in rawDataFrame.iterrows():
        try:
            columnList = [int(i) for i in rawDataFrame.columns.to_list()]
            if countryName in data:
                for year in columnList:
                    if yearMin<=year and year<=yearMax:
                        try:
                            value = float(str(row[str(year)]).encode("ascii","ignore").decode("ascii"))
                            data[countryName][year].append(value)
                        except Exception as err:
                            print(err)
        except Exception as err:
            print("Parse file error : ", err)
    return data

data = {}
for country in CountriesToKeep:
    data[country] = defaultdict(list)
    #for year in range (YearRange[0], YearRange[1]+1):
    #    data[country][year] = []

data = loadFile(file1, data, YearRange[0], YearRange[1])
data = loadFile(file3, data, YearRange[0], YearRange[1])
data = loadFile(file4, data, YearRange[0], YearRange[1])
data = loadFile(file5, data, YearRange[0], YearRange[1])
data = loadFile(file6, data, YearRange[0], YearRange[1])
data

