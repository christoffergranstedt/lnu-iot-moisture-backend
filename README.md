## IoT project - Moisture Level

An IoT project I did in a course at Linnaeus University. A thing, a moisture sensor, is sending the moisture level from a plant via an MQTT broker (CloudMQTT) to a backend server. A frontend is displaying the data that is fetched from the backend server. Notifications are sent from the backend to the user’s connected Telegram account via a Telegram bot. 

### Repositories in project
Thing - [https://github.com/christoffergranstedt/lnu-iot-moisture-thing](https://github.com/christoffergranstedt/lnu-iot-moisture-thing)  
Backend - [https://github.com/christoffergranstedt/lnu-iot-moisture-backend](https://github.com/christoffergranstedt/lnu-iot-moisture-backend)  
Frontend - [https://github.com/christoffergranstedt/lnu-iot-moisture-frontend](https://github.com/christoffergranstedt/lnu-iot-moisture-frontend)  

### Backend repository
This is the backend repository. The backend is written in TypeScript as an Express server. The server is trying to follow the conventions of [Web of Things](https://www.w3.org/WoT/documentation/#web-of-things-in-a-nutshell) with things that are built by events, actions, and properties. All possible routes are not implemented yet but the ones necessary for the project is implemented. The server uses MongoDB and Mongoose for handling permanent storage. The server is listening to MQTT topics in normal circumstances but since the Moisture thing is not in use for the moment the MQTT connection is off. Instead, a CRON-job adds new random values that are stored in the database. The user can get notifications about low or high moisture warnings via a connected Telegram account that the user has chosen. 


The main branch is automatically deployed to Heroku. The server sleeps after 30 minutes so the initial request may take some time before response.