import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.json('yo');
});

const PORT = 3009;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
