var express = require('express');
var router = express.Router();

var User = require("../models/user");
var Beverages = require("../models/beverage");

// USERS INDEX ROUTE
router.get('/', function (request, response, next) {

    // find all of the users
    User.find({})
        .exec(function (error, userList) {

            if (error) {
                console.log("Error while retrieving users: " + error);
                return;
            }

            response.render('users/index', {
                userList: userList
            });
        })
})

// USER CREATE FORM (NEW)
router.get('/new', function (request, response) {

    // render the new user form
    response.render('users/new');
});

// USER CREATE ROUTE
router.post('/', function (request, response) {

    // grab the new user information from the form POST
    var newUserFromForm = request.body;

    // then create a new User from the User model in your schema
    var user = new User({
        first_name: newUserFromForm.first_name,
        last_name: newUserFromForm.last_name,
        email: newUserFromForm.email
    });

    // then save the new user to the database
    user.save(function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
    
        response.redirect('/users');
    });

});

// USER SHOW ROUTE
router.get('/:id', function (request, response) {

    // grab the ID of the user we want to show
    var userId = request.params.id;

    // then find the user in the database using the ID
    User.findById(userId)
        .exec(function (error, user) {

            if (error) {
                console.log("Error while retrieving user with ID of " + userId);
                console.log("Error message: " + error);
                return;
            }
        
            response.render('users/show', {
                user: user,
                userId: request.params.id
            });
        });

});

// USER EDIT ROUTE
router.get('/edit/:id', function (request, response) {

    // grab the ID of the user we want to edit from the parameters
    var userId = request.params.id;

    // then find the user we want to edit in the database, using the ID
    User.findById(userId)
        .exec(function (error, user) {

            if (error) {
                console.log("Error while retrieving user with ID of " + userId);
                console.log("Error message: " + error);
                return;
            }

            response.render('users/edit', {
                user: user
            });
        });
});

// USER UPDATE ROUTE
router.put('/:id', function (request, response) {

    // grab the ID of the user we want to update from the parameters
    var userId = request.params.id;

    // then grab the edited user info from the form's PUT request
    var newUserInfo = request.body;

    // then find the user in the database, and update its info to
    // match what was updated in the form
    // (remember to pass { new: true })
    User.findByIdAndUpdate(userId, newUserInfo, { new: true })
        .exec(function (error, user) {

            if (error) {
                console.log("Error while updating User with ID of " + userId);
                return;
            }

            response.redirect('/users/' + userId);

        });
});

// USER DELETE
router.get('/delete/:id', function (request, response) {

    // grab the ID of the user we want to delete from the parameters
    var userId = request.params.id;

    // then find and delete the user, using the ID
    User.findByIdAndRemove(userId)
        .exec(function (error, user) {

            if (error) {
                console.log("Error while deleting User with ID of " + userId);
                return;
            }
            // once the user has been deleted, redirect back to the users index
            response.redirect('/users');
        });
});

// BEVERAGE INDEX ROUTE
router.get('/:userId/beverages/', function (request, response) {

    // grab the ID of the user we want to show
    var userId = request.params.userId;

    User.findById(userId)
        .exec(function (error, user) {

            if (error) {
                console.log("Error while retrieving user with ID of " + userId);
                console.log("Error message: " + error);
                return;
            }
            // once we've found the user, pass the user object to Handlebars to render
            response.render('beverages/index', {
                user: user
            });
            console.log(user);
        });

});

// SHOW NEW BEVERAGE FORM
router.get('/:userId/beverages/new', function (request, response) {

    // grab the ID of the user we want to create a new beverage for
    var userId = request.params.userId;

    // then render the new beverage form, passing along the user ID to the form
    response.render('beverages/new', {
        userId: userId
    })
});

// ADD A NEW BEVERAGE
router.post('/:userId/beverages/', function (request, response) {

    // grab the user ID we want to create a new beverage for
    var userId = request.params.userId;

    // then grab the new Beverage info that we created using the form
    var newBeverageName = request.body.name;
    var newBeverageType = request.body.type;
    var newBeverageDrinkDate = request.body.drinkDate;
    var newBeverageStyle = request.body.style;
    var newBeveragePrice = request.body.price;
    var newBeverageRating = request.body.rating;
    var newBeverageComments = request.body.comments;

    // Find the User in the database we want to save the new Beverage for
    User.findById(userId)
        .exec(function (err, user) {

            // data submitted off of the form
            user.beverages.push(new Beverages({
                name: newBeverageName,
                type: newBeverageType,
                drinkDate: newBeverageDrinkDate,
                style: newBeverageStyle,
                price: newBeveragePrice,
                rating: newBeverageRating,
                comments: newBeverageComments
            }));

            user.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.redirect('/users/' + userId + '/beverages');
            })
        });
});

// SHOW A BEER BY TYPE
router.get('/:userId/beer', function (request, response) {

    // find the ID of the user we would like to edit
    var userId = request.params.userId;

    // find the User by ID
    User.findById(userId)
        .exec(function (error, user) {
            // collection of Beverages that matches our Beverage ID above
            var arrayOfTypeBeer = [];
            var beers = function () {
                for (let i = 0; i < user.beverages.length; i++) {
                    if (user.beverages[i].type === 'Beer') {
                        arrayOfTypeBeer.push(user.beverages[i]);
                    }
                }
            }
            beers();

            response.render('beverages/beer', {
                user: user,
                userId: userId,
                arrayOfTypeBeer: arrayOfTypeBeer
            })
        });
});

// SHOW A WINE BY TYPE
router.get('/:userId/wine', function (request, response) {

    // find the ID of the user we would like to edit
    var userId = request.params.userId;

    // find the User by ID
    User.findById(userId)
        .exec(function (error, user) {
            // collection of Beverages that matches our Beverage ID above
            var arrayOfTypeWine = [];
            var wines = function () {
                for (let i = 0; i < user.beverages.length; i++) {
                    if (user.beverages[i].type === 'Wine') {
                        arrayOfTypeWine.push(user.beverages[i]);
                    }
                }
            }
            wines();

            response.render('beverages/wine', {
                wines: wines,
                user: user,
                userId: userId,
                arrayOfTypeWine: arrayOfTypeWine
            })
        });
});

// SHOW A SPIRIT BY TYPE
router.get('/:userId/spirits', function (request, response) {

    // find the ID of the user we would like to edit
    var userId = request.params.userId;

    // find the User by ID
    User.findById(userId)
        .exec(function (error, user) {
            // once we have found the User, find the Beverage in that user's 
            // collection of Beverages that matches our Beverage ID above
            var arrayOfTypeSpirit = [];
            var spirits = function () {
                for (let i = 0; i < user.beverages.length; i++) {
                    if (user.beverages[i].type === 'Spirits') {
                        arrayOfTypeSpirit.push(user.beverages[i]);
                    }
                }
            }
            spirits();

            response.render('beverages/spirit', {
                spirits: spirits,
                user: user,
                userId: userId,
                arrayOfTypeSpirit: arrayOfTypeSpirit
            })
        });
});

// SHOW A BEVERAGE
router.get('/:userId/beverages/:beverageId', function (request, response) {

    // find the ID of the user we would like to edit
    var userId = request.params.userId;

    // find the ID of the beverage we would like to edit for the User above
    var beverageId = request.params.beverageId;

    // find the User by ID
    User.findById(userId)
        .exec(function (error, user) {

            // once we have found the User, find the Beverage in that user's 
            // collection of Beverages that matches our Beverage ID above
            var beverageToView = user.beverages.find(function (beverage) {
                return beverage.id === beverageId;
            })
            var drinkDateFormattedForShow = beverageToView.drinkDate.toISOString().slice(0, 10);
            response.render('beverages/show', {
                user: user,
                beverageId: beverageId,
                userId: userId,
                beverageToView: beverageToView,
                drinkDateFormattedForShow: drinkDateFormattedForShow
            });
        });
});

// REMOVE A BEVERAGE
router.delete('/:userId/beverages/:id', function (request, response) {
    var userId = request.params.userId;
    var beverageId = request.params.id;
    // REMOVE AN ITEM
    User.findByIdAndUpdate(userId, {
        $pull: {
            beverages: { _id: request.params.id }
        }
    })
        .exec(function (err, item) {
            if (err) {
                console.log(err);
                return;
            }
            response.redirect('/users/' + userId + '/beverages');
        })
});

// SHOW THE BEVERAGE EDIT FORM
router.get('/:userId/beverages/:beverageId/edit', function (request, response) {

    // grab the ID of the user whose Beverage we would like to edit
    var userId = request.params.userId;

    // then grab the ID of the Beverage we would like to edit for the User above
    var beverageId = request.params.beverageId;

    // find the User by ID
    User.findById(userId)
        .exec(function (error, user) {
            
            var beverageToEdit = user.beverages.find(function (beverage) {
                return beverage.id === beverageId;
            })

            //script to have the date show in edit
            var drinkDateFormattedForForm = beverageToEdit.drinkDate.toISOString().slice(0, 10);
            response.render('beverages/edit', {
                userId: userId,
                beverageId: beverageId,
                beverageToEdit: beverageToEdit,
                drinkDateFormattedForForm: drinkDateFormattedForForm
            })
        })

});

// EDIT A BEVERAGE
router.put('/:userId/beverages/:beverageId', function (request, response) {

    // find the ID of the user we would like to edit
    var userId = request.params.userId;

    // find the ID of the beverage we would like to edit for the User above
    var beverageId = request.params.beverageId;

    // grab the edited information about the Beverage from the form
    var editedBeverageFromForm = request.body;

    // find the User by ID
    User.findById(userId)
        .exec(function (error, user) {
           
            var beverageToEdit = user.beverages.find(function (beverage) {
                return beverage.id === beverageId;
            })

            // new information from the form
            beverageToEdit.name = editedBeverageFromForm.name;
            beverageToEdit.drinkDate = editedBeverageFromForm.drinkDate;
            beverageToEdit.style = editedBeverageFromForm.style;
            beverageToEdit.price = editedBeverageFromForm.price;
            beverageToEdit.rating = editedBeverageFromForm.rating;
            beverageToEdit.comments = editedBeverageFromForm.comments;

            // once we have edited the Beverage, save the user to the database
            user.save({ multi: true }, function (error, user) {

                response.redirect('/users/' + userId + '/beverages')
            });
        });
});

module.exports = router;
