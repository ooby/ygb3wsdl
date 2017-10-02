## SOAP-сервер для интеграционных сервисов [YGB3](https://www.ygb3.ru/)

1. `npm i`
2. Создать файл конфигурации `config/config.json`:
```json
{
    "config": {
        "port": 80, // порт http-сервера SOAP
        "mongoose": {
            "host": "127.0.0.1", // IP-адрес mongoDb
            "port": 27017, // порт mongoDb
            "username": "user",
            "password": "password",
            "db": "refbook", // имя базы данных для сохранения
            "options": {
                "useMongoClient": true,
                "socketTimeoutMS": 10000,
                "keepAlive": true,
                "reconnectTries": 30
            }
        }
    }
}
```
3. `npm start`