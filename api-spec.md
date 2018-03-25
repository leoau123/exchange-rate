# API Specification
## Latest Rates Endpoint
This endpoint return real-time exchange rate data for all available or a specific set of currencies updated every 60 minutes.

### API Request
```
https://13.250.39.17/latest
    ?base=USD
    &symbols=HKD,GBP,JPY
    &prettyprint=true
```

### Request Parameters
|Parameter|Description|
|---|---|
|base|[Optional] A three-letter currency code of your preferred base currency. (default: USD)|
|symbols|[Optional] A list of comma-separated currency codes to limit output currencies.|
|prettyprint|[Optional] Set to `true` for pretty JSON. (default: `false`)|

### API Response
```
{
    "success": true,
    "base": "USD",
    "timestamp": 1521824399000,
    "date": "2018-03-23",
    "rates": {
        "HKD": 7.84624,
        "GBP": 0.706776,
        "JPY": 104.8385
    }
}
```
### Response Parameters
|Parameter|Description|
|---|---|
|success|Returns `true` or `false` depending on your API request has succeeded.|
|base|Returns the three-letter currency code of the base currency you requested.|
|timestamp|Returns the UNIX timestamp of this data was collected.|
|date|Returns the date of this data was collected.|
|rates|Returns the exchange rate data for the currencies you have requested.|

## Historical Rates Endpoint
This endpoint return an historical exchange rate data for all available or a specific set of currencies. Query the API by appending a date (fromat `YYYY-DD-MM`)

### API Request
```
https://13.250.39.17/historical/2018-03-21
    ?base=USD
    &symbols=HKD,GBP,JPY
    &prettyprint=true
```

### Request Parameters
|Parameter|Description|
|---|---|
|base|[Optional] A three-letter currency code of your preferred base currency. (default: USD)|
|symbols|[Optional] A list of comma-separated currency codes to limit output currencies.|
|prettyprint|[Optional] Set to `true` for pretty JSON. (default: `false`)|

### API Response
```
{
    "success": true,
    "base": "USD",
    "timestamp": 1521676799000,
    "date": "2018-03-21",
    "rates": {
        "HKD": 7.84495,
        "GBP": 0.707098,
        "JPY": 105.9427
    }
}
```
### Response Parameters
|Parameter|Description|
|---|---|
|success|Returns `true` or `false` depending on your API request has succeeded.|
|base|Returns the three-letter currency code of the base currency you requested.|
|timestamp|Returns the UNIX timestamp of this data was collected.|
|date|Returns the date of this data was collected.|
|rates|Returns the exchange rate data for the currencies you have requested.|

## Time-Series Endpoint
This endpoint return a set of historical exchange rate data for all available or a specific set of currencies by specific timeframe. Query the API by appending a start date and end date (fromat `YYYY-DD-MM`).The maximum time frame is 365 days.

### API Request
```
https://13.250.39.17/timeseries/2018-03-21/2018-03-23
    ?base=USD
    &symbols=HKD,GBP,JPY
    &prettyprint=true
```

### Request Parameters
|Parameter|Description|
|---|---|
|base|[Optional] A three-letter currency code of your preferred base currency. (default: USD)|
|symbols|[Optional] A list of comma-separated currency codes to limit output currencies.|
|prettyprint|[Optional] Set to `true` for pretty JSON. (default: `false`)|

### API Response
```
{
    "success": true,
    "base": "USD",
    "start_date": "2018-03-21",
    "end_date": "2018-03-23",
    "rates": {
        "2018-03-21": {
            "HKD": 7.84495,
            "GBP": 0.707098,
            "JPY": 105.9427
        },
        "2018-03-22": {
            "HKD": 7.84835,
            "GBP": 0.708607,
            "JPY": 104.961
        },
        "2018-03-23": {
            "HKD": 7.84624,
            "GBP": 0.706776,
            "JPY": 104.8385
        }
    }
}
```
### Response Parameters
|Parameter|Description|
|---|---|
|success|Returns `true` or `false` depending on your API request has succeeded.|
|base|Returns the three-letter currency code of the base currency you requested.|
|start_date|Returns the start date you requested.|
|end_date|Returns the end date you requested.|
|rates|Returns the exchange rate data for the currencies you have requested.|

## Convert Endpoint
This endpoint return a converted amount from one currency to another. This API also possible to convert currencies using historical exchange rate data. To do so, please add the `date` parameter and specifiy the date you want (format `YYYY-MM-DD`).

### API Request
```
https://13.250.39.17/convert
    ?from=USD
    &to=HKD
    &amount=100.5
    &date=2018-03-21
    &prettyprint=true
```

### Request Parameters
|Parameter|Description|
|---|---|
|from|[Required] A three-letter currency code of your preferred converted from.|
|to|[Required] A three-letter currency code of your preferred converted to.|
|amount|[Required] The amount to be converted.|
|date|[Optional] A date (format `YYYY-MM-DD`) to use historical exchange rates for the conversion|
|prettyprint|[Optional] Set to `true` for pretty JSON. (default: `false`)|

### API Response
```
{
    "success": false,
    "from": "USD",
    "to": "HKD",
    "amount": 100.5,
    "timestamp": 1521676799000,
    "date": "2018-03-21",
    "rate": 7.84495,
    "result": 788.417475
}
```
### Response Parameters
|Parameter|Description|
|---|---|
|success|Returns `true` or `false` depending on your API request has succeeded.|
|from|Returns the three-letter currency code of the currency your preferred converted from.|
|to|Returns the three-letter currency code of the currency your preferred converted to.|
|amount|Returns the amount you requested.|
|timestamp|Returns the UNIX timestamp of this data was collected.|
|date|Returns the date of this data was collected.|
|rates|Returns the exchange rate for the currencies you your preferred converted to.|
|result|Returns the coverted amount.|

## Support Sysmbol Endpoint
This endpoint return a list of sysbomls avaliable for this solution. You may specific the three-letter currency code to check the sysboml is avaliable for this solution.

### API Request
```
https://13.250.39.17/check/HKD
    ?prettyprint=true
```

### Request Parameters
|Parameter|Description|
|---|---|
|prettyprint|[Optional] Set to `true` for pretty JSON. (default: `false`)|

### API Response
```
{
    "success": true,
    "timestamp": 1521964610173,
    "date": "2018-03-25",
    "symbols": {
       "HKD": "Hong Kong Dollar"
    }
}
```
### Response Parameters
|Parameter|Description|
|---|---|
|success|Returns `true` or `false` depending on your API request has succeeded.|
|timestamp|Returns the UNIX timestamp of this data was collected.|
|date|Returns the date of this data was collected.|
|symbols|Returns all supported currencies with their respective three-letter currency codes and names.|

## Get Sysmbol Endpoint
This endpoint return a three-letter currency code by the co=urrency name you specificed.

### API Request
```
https://13.250.39.17/code/Hong Kong Dollar
    ?prettyprint=true
```

### Request Parameters
|Parameter|Description|
|---|---|
|prettyprint|[Optional] Set to `true` for pretty JSON. (default: `false`)|

### API Response
```
{
    "success": true,
    "timestamp": 1521964610173,
    "date": "2018-03-25",
    "symbols": {
        "Hong Kong Dollar": "HKD"
    }
}
```
### Response Parameters
|Parameter|Description|
|---|---|
|success|Returns `true` or `false` depending on your API request has succeeded.|
|timestamp|Returns the UNIX timestamp of this data was collected.|
|date|Returns the date of this data was collected.|
|symbols|Returns all supported currencies with their respective three-letter currency codes and names.|
