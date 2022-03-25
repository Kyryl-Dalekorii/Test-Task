const express = require('express');
const redis = require('redis');
const axios = require('axios');

const runApp = async () => {
  // connect to redis
  const client = redis.createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  console.log('Redis connected!');

  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // just to make requests to localhost work
  // does not relate to caching process at alls

  app.get('/domain/:domain', async (req, res) => {
    const { domain } = req.params;
    const { token, limit = 10 } = req.query;
    try {
      const cachedDomain = await client.get(domain);
      if (cachedDomain) {
        return res.status(200).json(JSON.parse(cachedDomain));
      }

      const requestedDomain = await axios.get(
        `https://host.io/api/web/${domain}?token=${token}&limit=${limit}`
      );

      await client.set(domain, JSON.stringify(requestedDomain));

      return res.status(200).json(requestedDomain);
    } catch (err) {
      return res.status(200).json({
        error: true,
        message: `Domain with name ${domain} was not found`
      });
    }
  });

  app.listen(3001, () => {
    console.log(`server is running`);
  });
};

runApp();
