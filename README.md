# kana-api
Kana API is the distributed API service for Rin-pr's Opentracker.

### Deployment

* Linux 3.2+
* Node.js 0.10.0+/0.12.0+
* Opentracker with Rin-pr patch
* `npm install`
* `npm start`

### Configuration

Configuration file is `config.js`, you could copy it from file `config.js.example`

* Add rin-pr's IP(s) to `config['security'].ip_whitelist` array
* Generate a new hash for `config['security'].api_key`
* Edit other settings for your need.

### API

* Add infoHash
  * Path: `/add`
  * Method: `POST`
  * Formdata:
    * `key`: your api key
    * `infoHash`: infoHash to be added
  * HTTP StatusCode Returns:
    * `200` - infoHash Added and reloaded tracker
    * `400` - Invalid infoHash
    * `403` - Invalid IP or Key
    * `500` - Error when adding infoHash to whitelist

### TODO

* Cron job to synchronize whitelist file
