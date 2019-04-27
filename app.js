const express       = require('express'),
      bodyparser    = require('body-parser'),
      mongoose      = require('mongoose'),
      methodOerride = require('method-override'),
      app           = express(),
      port          = 3000;

// App configuration
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOerride('_method'));

// connect to database
mongoose.connect('mongodb://localhost:27017/note', {useNewUrlParser: true});

// Mongoose MODEL Configuration
// Notes database schema
const notesSchema = new mongoose.Schema ({
    title: String,
    body: String,
    dateCreated: {type: Date, default: Date.now}
});

// Create database for Notes
const Notes = mongoose.model('Note', notesSchema);

// Create a note in database
// createNote();

// function createNote () {
//     Notes.create({
//         title: 'Mangas reading',
//         body: 'Shinmai Maou no keiyakusha Manga: 19, Domestik na kanojo: 83, Gokukoku no Brynhildr: 167, Minamoto monogatari: 207'
//     });
// }

// Root Route
app.get('/', function(req, res){
    res.redirect('/notes');
});

// INDEX Route
app.get('/notes', function(req, res){
    Notes.find({}, function(err, notes){
        if(err){
            console.log(err);
        } else {
            res.render('index', {notes: notes})
        }
    });
});

// CREATE Route
app.post('/notes', function(req, res){
    // Create new note
    Notes.create(req.body.note, function(err, newNote){
        if(err) {
            res.render('new');
        } else {
            res.redirect('/notes');
        }
    });
});

// SHOW Route
app.get('/notes/:id', function(req, res){
    Notes.findById(req.params.id, function(err, foundNote){
        if(err) {
            res.redirect('/notes');
        } else {
            res.render ('ShowNote', {note: foundNote})
        }
    });
});

// EDIT Route
app.get('/notes/:id/edit', function(req, res){
    Notes.findById(req.params.id, function(err, foundNote){
        if (err){
            // res.redirect('/notes');
            console.log(err);
        } else {
            res.render('edit', {note: foundNote});
        }
    });
});

// UPDATE Route
app.put('/notes/:id', function(req, res){
    Notes.findByIdAndUpdate(req.params.id, req.body.note, function(err, editedNote){
        if(err){
            res.redirect('/notes');
        } else {
            res.redirect('/notes');
        }
    });
});

// DELETE Route
app.delete('/notes/:id', function(req, res){
    // destroy Note
    Notes.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect('/notes');
        } else {
            res.redirect('/notes');
        }
    });
});

app.listen(port, function(){
    console.log('Listening on port', port);
});