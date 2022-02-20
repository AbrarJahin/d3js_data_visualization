import pandas as pd
from collections import defaultdict
import math
import os

path ="../raw-data"

saveFileAddress = "../cleaned_data/processed_data.csv"

#CountriesToKeep = {'Canada', 'France', 'United States', 'United Kingdom'}

YearRange = [1991, 2010]

########################################################################################
def getFileAndProperties(folderPath):
    #we shall store all the file names in this list
    filelist = []
    for root, dirs, files in os.walk(folderPath):
        for file in files:
            #append the file name to the list
            filelist.append(os.path.join(root,file))
    return filelist

def getPropertyFromFilePath(filePath):
    baseFileName = os.path.basename(filePath)
    fileName = os.path.splitext(baseFileName)[0]
    propertyName = ''.join(ch.lower() if ch not in [" ", '_', '-'] else '_' for ch in fileName if ch.isalnum() or ch in [" ", '_', '-'])
    return propertyName

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

def saveFile(data, propertyList, fileAddress = saveFileAddress):
    df = pd.DataFrame(columns=['country','year'])
    error = defaultdict(dict)
    for country in data:
        for year in data[country]:
            dictonaryData = {
                        'country':country,
                        'year':int(year)
                     }
            for index, property in enumerate(propertyList):
                try:
                    dictonaryData[property] = data[country][year][index]
                except Exception as OutOfIndexError:
                    error[property][year] = country
            df = df.append(dictonaryData, ignore_index=True)
    df.to_csv (fileAddress, index = None, header=True)
    print("File Save Completed with This errors-")
    print(dict(error))

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
    return data

def getDataFromFolderPath(folderPath):
    filePathList = getFileAndProperties(folderPath)
    propertyList = []
    data = defaultdict(str)
    for filePath in filePathList:
        propertyName = getPropertyFromFilePath(filePath)
        data = loadFile(filePath, data, YearRange[0], YearRange[1])
        propertyList.append(propertyName)
    return data, propertyList

data, propertyList = getDataFromFolderPath(path)
data = filterData(data, 5)
saveFile(data, propertyList)
