require('dotenv').config();
const chalk = require('chalk');
const terminalLink = require('terminal-link');

const app = require('./app');
const PORT = process.env.PORT || 4000;

app.get('/', function (req, res) {
  res.send(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  const serverLink = terminalLink(
    chalk.bold('Server is running on port ' + PORT),
    `http://127.0.0.1:${PORT}`,
  );

  console.log(serverLink);
});
