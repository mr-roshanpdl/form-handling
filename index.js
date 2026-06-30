const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { ifError } = require('assert');
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render('index', { varFiles: files });
  });
});

app.post('/create', (req, res) => {
  const data = req.body;

  const fileTitle = data.title || 'untitled';

  const words = fileTitle.split(' ').filter(Boolean).slice(0, 3);

  const camelCaseConversion = words
    .map((ele, idx) => {
      if (idx === 0) {
        return ele.toLowerCase();
      }
      return ele.charAt(0).toUpperCase() + ele.slice(1).toLowerCase();
    })
    .join('');

  fs.writeFile(
    `./files/${camelCaseConversion || 'untitled'}.txt`,
    `${req.body.task}`,
    'utf-8',
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`./files/${filename}`, 'utf8', (err, data) => {
    if (err) throw err;
    res.render('read-more', { filename: filename, data: data });
  });
});

app.get('/edit/:filename', (req, res) => {
  const filename = req.params.filename;
  res.render('edit', {filename: filename})
});

app.post('/edit/', (req, res) => {
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}.txt`, (err) => {
    if(err) throw err;
    res.redirect('/');
  }); 
});

app.get('/delete/:filename',(req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
})

app.listen(PORT, () => {
  console.log(`Server  running on a port: ${PORT} http://localhost:${PORT}`);
});
