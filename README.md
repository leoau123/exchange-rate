# exchange-rate
This is AfterShip Git Challenge about Exchange Rate Solution and focus on back-end solution.

**exchange-rate** is a API server that delivering real-time exchange rate data around 170 counties. The server given mutiple endpoints and serving different use case. Endpoint functionalities include getting exchanged rate date for all or specificed set of currenicies, converting amounts from one currency to another, retrieving time series data for one or multiple currencies.

## Outstanding
Due to time limitation, there are lots of fetaure and sercuirty haven't implment and I will list out one by one.

**Feature:**
  - Fluctuation (Provide the rate changes from start date to end date, also providing higest, lowest and average rate between the timeframe)
  - Front-end GUI
  - Change default sysmbols and base for each user
  
**Security:**
  - User Authenication (A unique key assigned to each API account used to authenticate with the API)
  - MongoDB SSL Connection
  
**Monitoring:**
  - Process Monitoring
  - API staus
  
**Automation**
  - Automation Data Import
  
## Artitecture
This solution was used three tier network architecture to design.

![Image of architecture](https://image.ibb.co/cXJMH7/image.jpg)

## Technologies
### Language
- Node.js (v8.10.0)
### Libaray
- express (4.16.3)
- log4js (2.5.3)
- mongoose (5.0.11)
- uuid (3.2.1)
### Libaray for development
- chai (4.1.2)
- chai-http (4.0.0)
- mocha (5.0.5)
- should (13.2.1)
### Database
- MongoDB (3.6)
### Tool
- PM2

## API Specification
Please refer to [API Specification](api-spec.md) page.

## Error Handling
Please refer to [Error Handling](errors.md) page.

## Demo
[Link](https://13.250.39.17/)

## Others
### Scalability
I had used cluster with PM2 managment tool to maximize the scalability.

### Secuirty
Since data is our profits and senitive customer data will be consist, therefore secuirty is a critical part in development process.
In this project, SSL was applied to prevent man-in-the-middle attack. Moreover, we can also implment a ip whitelist to control which IPs canbe access the API server in order to maximize the secuirty.

In addition, SSL 2 way-auth can be applied for data trasnscation (data write).

## LinkedIn
[Link](https://www.linkedin.com/in/leo-au-4a855392/)
