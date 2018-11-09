const app = require('./server/server');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🌎 ==> Server listening now on port ${PORT}!`);
});
