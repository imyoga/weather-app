Here’s a detailed overview of all the **free data** you can access via the OpenWeatherMap **Current Weather** and **5‑day Forecast** endpoints, including time ranges, call limits, and available data fields:

---

## 📍 1. **Current Weather** (`/data/2.5/weather`)

* **Time range**: real-time, up-to-date data on each request.
* **Rate limits**:

  * Up to **60 calls/minute**
  * **1,000,000 calls/month** ([openweathermap.org][1])
* **Request parameters**: `lat`, `lon` or `q` (city name), `id`, `zip`; optional: `units`, `lang`, `mode` (defaults to JSON) ([openweathermap.org][2])
* **Key response fields**:

  ```
  coord, weather (id, main, description, icon), base,
  main (temp, feels_like, temp_min, temp_max, pressure, humidity),
  visibility,
  wind (speed, deg,…),
  clouds.all,
  rain.1h (or snow.1h),
  dt (timestamp),
  sys (type, id, country, sunrise, sunset),
  timezone, id, name, cod
  ```

  ([docs.openweather.co.uk][3])

---

## 📅 2. **5‑Day / 3‑Hour Forecast** (`/data/2.5/forecast`)

* **Time range**: forecast every 3 hours for **5 days** (40 timestamps) ([openweathermap.org][4])
* **Rate limits**: same as above (free tier)
* **Request parameters**: same as Current Weather + optional `cnt` (number of timestamps, max \~40), `units`, `lang`, `mode` (JSON/XML) ([Home Assistant][5], [openweathermap.org][4])
* **Response structure**:

  * `list[]`: each with `dt`, `main`, `weather[]`, `clouds`, `wind`, `visibility`, `pop` (precipitation probability), `rain` / `snow`, `sys`, `dt_txt`
  * Top-level `city` object: coordinates, country, timezone, sunrise, sunset ([openweathermap.org][4])

---

## ⚠️ Additional (but NOT included in free tier via these endpoints):

* **Hourly Forecast 4 days** (`/data/2.5/forecast/hourly`): PRO only ([openweathermap.org][6])
* **16‑Day Daily Forecast** (`/data/2.5/forecast/daily`): Paid tier ([openweathermap.org][7])

---

## 🛠️ Exhaustive Field Breakdown

Here's a structured table of all available fields returned under the free endpoints:

| Category              | Fields                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| **Coordinate**        | `coord.lat`, `coord.lon`                                                                                 |
| **Weather**           | `weather[].id, main, description, icon`                                                                  |
| **Main**              | `temp, feels_like, temp_min, temp_max, pressure, humidity, sea_level, grnd_level` *(some from forecast)* |
| **Visibility**        | `visibility` (meters)                                                                                    |
| **Wind**              | `speed, deg, gust`                                                                                       |
| **Clouds**            | `clouds.all` (% of cloud cover)                                                                          |
| **Precipitation**     | `rain.1h`, `rain.3h`, `snow.1h`, `snow.3h`                                                               |
| **Forecast-specific** | `pop` (probability of precipitation), `dt_txt`                                                           |
| **Sys**               | `country`, `sunrise`, `sunset`, `pod` *(forecast)*                                                       |
| **Timestamps**        | `dt` (UTC unix), `dt_txt` (forecast)                                                                     |
| **City info**         | `city.id, city.name, city.coord, city.country, city.timezone, city.sunrise, city.sunset`                 |
| **Base/cod**          | `base` (stations), `cod` (status code)                                                                   |

---

## ✅ Summary for Your PRD

### ✅ **Endpoints & Time Ranges**

1. `GET /data/2.5/weather` – current snapshot
2. `GET /data/2.5/forecast` – 5‑day / 3‑hr interval forecast

### 🚦 **Rate Limits**

* 60 calls per minute
* Up to 1,000,000 requests per month ([openweathermap.org][8], [docs.openweather.co.uk][3], [openweathermap.org][1], [openweathermap.org][6], [openweathermap.org][9], [openweathermap.org][4])

### 📊 **Available Data Fields**

(Covered above)

---

[1]: https://openweathermap.org/full-price?utm_source=chatgpt.com "Pricing page - detailed comparison"
[2]: https://openweathermap.org/current?utm_source=chatgpt.com "Current weather data"
[3]: https://docs.openweather.co.uk/appid?utm_source=chatgpt.com "How to start to work with Openweather API"
[4]: https://openweathermap.org/forecast5?utm_source=chatgpt.com "5 day weather forecast"
[5]: https://www.home-assistant.io/integrations/openweathermap/?utm_source=chatgpt.com "OpenWeatherMap"
[6]: https://openweathermap.org/api/hourly-forecast?utm_source=chatgpt.com "Hourly Weather Forecast 4 days"
[7]: https://openweathermap.org/api?utm_source=chatgpt.com "Weather API"
[8]: https://openweathermap.org/price?utm_source=chatgpt.com "Pricing"
[9]: https://openweathermap.org/weather-data?utm_source=chatgpt.com "Units in API response"
