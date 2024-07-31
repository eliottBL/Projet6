const book = require('../models/book');
const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save().then(
        () => {
            res.status(201).json({
                message: 'livre enregistré'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then((book) => {
        res.status(200).json(book);
    }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};




exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };


    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};


exports.rateBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then((book) => {
        //TODO : test si deja noté,  else :
        const rating = {
            userId: req.auth.userId,
            grade: req.body.rating
        }
        book.ratings.push(rating);
        book.save();

        //Moyenne
        let grades = [];
        for (let i = 0; i < book.ratings.length; i++) {
            grades.push(book.ratings[i].grade);
        }
        const totalGrades = grades.reduce(
            (accumulator, currentValue) => accumulator + currentValue, 0,
        );
        const noteMoyenne = totalGrades / book.ratings.length;
        book.averageRating = noteMoyenne;
        book.save();

        res.status(200).json(book);
    })
};
/*
for (let i = 0; i < book.ratings.length; i++) {
            if (book.ratings[i].userId = req.auth.userId) {
                res.status(200).json(book);
                return console.log('nope')
            } else {
*/


exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllBook = (req, res, next) => {
    Book.find().then(
        (books) => {
            res.status(200).json(books);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.topThree = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(
            (top3books) => {
                res.status(200).json(top3books);
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};
