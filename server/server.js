const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const filePath = path.join(__dirname, 'data', 'sample.json');

app.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading data from file' });
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
    console.log(jsonData);
  });
});

app.post('/data', (req, res) => {
const currentDateTime = new Date();
currentDateTime.setHours(currentDateTime.getHours() + 7);
const formattedDateTime = currentDateTime.toUTCString();
  const { row, col, rep } = req.body;
  const newData = {
    name:formattedDateTime,
    rows: row,
    columns: col,
    repaly:rep
  };
  
  
  // Read the existing data from the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading data from file' });
      return;
    }

    let jsonData = JSON.parse(data);

    console.log('Existing data:', jsonData);

    // Push the new data to the JSON array
    jsonData.push(newData);

    console.log('Updated data:', jsonData);

    // Write the updated data back to the JSON file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error writing data to file' });
        return;
      }

      console.log('New data added to sample.json');
      res.json({ message: 'New data added to sample.json'});
    });
  });
});




app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});