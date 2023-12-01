const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const appId = "261cceac";
const appKey = "7c7e60f0fa46d04a712dcef794a6b27e";

app.get("/api/flights/:page/:scheduleDate", async (req, res) => {
  const { page, scheduleDate } = req.params;
  try {
    const response = await axios.get(
      `https://api.schiphol.nl/public-flights/flights?scheduleDate=${scheduleDate}&page=${page}&sort=%2BscheduleTime`,
      {
        headers: {
          app_id: appId,
          app_key: appKey,
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );

    res.json({ flights: response.data.flights });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

//Detay sayfası için endpoint
app.get("/api/flights/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://api.schiphol.nl/public-flights/flights/${id}`,
      {
        headers: {
          app_id: appId,
          app_key: appKey,
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );

    const airlines = await axios.get(
      `https://api.schiphol.nl/public-flights/airlines/${response.data.prefixIATA}`,
      {
        headers: {
          app_id: appId,
          app_key: appKey,
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );

    const objectData = {
      flightDetails: response.data,
      airlines: airlines.data,
    };

    res.json(objectData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

/*app.get('/api/flights', async (req, res) => {
    try {
        let combinedData = [];

        for (let index = 0; index <= 10; index++) {
            const response = await axios.get(`https://api.schiphol.nl/public-flights/flights?&page=${index}`, {
                headers: {
                    app_id: appId,
                    app_key: appKey,
                    Accept: "application/json",
                    ResourceVersion: "v4",
                }
            });

            combinedData = [...combinedData, ...response.data.flights];
        }

        res.json({flights: combinedData});

        //  res.json(response.data);

         const response = await axios.get('https://api.schiphol.nl/public-flights/flights?includedelays=false&page=0&sort=%2BscheduleTime', {
             headers: {
                 app_id: appId,
                 app_key: appKey,
                 Accept: "application/json",
                 ResourceVersion: "v4",
             }
         });
        https://api.schiphol.nl/public-flights/flights?app_id=[app_id]&app_key=[app_key]&page=1>;

        rel="next", <https://api.schiphol.nl/public-flights/flights?app_id=[app_id]&app_key=[app_key]&page=155>; rel="last"

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Error fetching data'});
    }
});*/

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
