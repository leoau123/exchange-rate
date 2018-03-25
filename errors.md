# Error Handling
Whenever a requeted resource is not available or an API call fails for another reason, a JSON error is returned. Errors always come with an error code and a description.

## Example
The following error is returned if resource is not exist.
```
{
    "success": false,
    "error": {
        "code": 404,
        "info": "The requested resource does not exist."
    }
}
```
## Error Specification
|Error Code|Description|
|---|---|
|106|The current request did not return any results.|
|107|No symbol was found.|
|201|An invalid base currency has been entered.|
|202|One or more invalid symbols have been specified.|
|203|An invalid from/to currency has been entered.|
|204|An invalid amount has been entered.|
|302|An invalid date has been specified.|
|401|Missing the request from/to/amount.|
|404|The requested resource does not exist.|
|405|The method was not allowed for this requested API endpoint.|
|500|Internal Server Error.|
|502|An invalid start has been specified.|
|503|An invalid end has been specified.|
|504|An invalid timeframe has been specified.|
|505|The specified timeframe is too long, exceeding 365 days.|
|506|No start/end has been specified.|
