# kana-api
Kana API is the distributed API service for Rin-pr's Opentracker.

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
