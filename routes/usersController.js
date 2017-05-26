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

            // then pass the list of users to Handlebars to render
            response.render('users/index', {
                userList: userList
            });
        })
})

// USER CREATE FORM (NEW)
router.get('/new', function (request, response) {

    // simply render the new user form
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
        
        // once the new user has been saved, redirect to the users index page
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

            // once we've found the user, pass the user object to Handlebars to render
            response.render('users/show', {
                user: user
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

            // once we have found the user, pass the user info to the
            // user edit form so we can pre-populate the form with existing data
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

            // once we have found the user and updated it, redirect to 
            // that user's show route
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
router.get('/:userId/beverages/', function (request, response, next) {

     // grab the ID of the user we want to show
   var userId = request.params.userId;

   User.findById(userId)
        .exec(function (error, user) {

            if (error) {
                console.log("Error while retrieving user with ID of " + userId);
                console.log("Error message: " + error);
                return;
            }
       
    // find all of the beverages for the user
    Beverages.find({})
        .exec(function (error, beverageList) {

            if (error) {
                console.log("Error while retrieving beverages: " + error);
                return;
            }

            response.send(beverageList);
            // then pass the list of beverages to Handlebars to render
            // response.render('beverages/index', {
            //     beverageList: beverageList,
            //     user: user,
            //     userId: userId
            // });
        })
    });
})

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

    // then grab the new Beverage that we created using the form
var newBeverageFromForm = request.body;

var beverage = new Beverages({
    name: newBeverageFromForm.name,
    type: newBeverageFromForm.type,
    drinkDate: newBeverageFromForm.drinkDate,
    rating: newBeverageFromForm.rating,
    drinkable: newBeverageFromForm.drinkable,
    comments: newBeverageFromForm.comments
});

    // Find the User in the database we want to save the new Beverage for
    User.findById(userId)
        .exec(function (err, user) {

            // add a new Beverage to the User's list of beverages, using the data
            // we grabbed off of the form
            user.beverages.push(new Beverages({beverage}));

            // once we have added the new Beverage to the user's collection 
            // of beverages, we can save the user
            beverage.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                // once the user has been saved, we can redirect back 
                // to the User's show page, and we should see the new beverage
                response.redirect('/users/' + userId+'/beverages');
            })
        });
});
// // REMOVE AN BEVERAGE
// router.get('/:userId/beverages/:beverageId/delete', function (request, response) {

//     // grab the ID of the User we would like to delete an beverage for
//     var userId = request.params.userId;

//     // grab the ID of the Beverage we would like to delete for the User ID above
//     var beverageId = request.params.beverageId;

//     // use Mongoose to find the User by its ID and delete the Beverage 
//     // that matches our Beverage ID
//     User.findByIdAndUpdate(userId, {
//         $pull: {
//             beverages: { _id: beverageId }
//         }
//     })
//         .exec(function (err, beverage) {
//             if (err) {
//                 console.log(err);
//                 return;
//             }

//             // once we have deleted the beverage, redirect to the user's show page
//             response.redirect('/users/' + userId);
//         })
// });

// // SHOW THE BEVERAGE EDIT FORM
// router.get('/:userId/beverages/:beverageId/edit', function (request, response) {

//     // grab the ID of the user whose Beverage we would like to edit
//     var userId = request.params.userId;

//     // then grab the ID of the Beverage we would like to edit for the User above
//     var beverageId = request.params.beverageId;

//     // find the User by ID
//     User.findById(userId)
//         .exec(function (error, user) {

//             // once we have found the User, find the Beverage in its' array 
//             // of beverages that matches the Beverage ID above
//             var beverageToEdit = user.beverages.find(function (beverage) {
//                 return beverage.id === beverageId;
//             })

//             // Once we have found the beverage we would like to edit, render the 
//             // Beverage edit form with all of the information we would like to put 
//             // into the form
//             response.render('beverages/edit', {
//                 userId: userId,
//                 beverageId: beverageId,
//                 beverageToEdit: beverageToEdit
//             })
//         })

// });

// // EDIT AN BEVERAGE
// router.put('/:userId/beverages/:beverageId', function (request, response) {

//     // find the ID of the user we would like to edit
//     var userId = request.params.userId;

//     // find the ID of the beverage we would like to edit for the User above
//     var beverageId = request.params.beverageId;

//     // grab the edited information about the Beverage from the form
//     var editedBeverageFromForm = request.body;

//     // find the User by ID
//     User.findById(userId)
//         .exec(function (error, user) {

//             // once we have found the User, find the Beverage in that user's 
//             // collection of Beverages that matches our Beverage ID above
//             var beverageToEdit = user.beverages.find(function (beverage) {
//                 return beverage.id === beverageId;
//             })

//             // update the beverage we would like to edit with the new 
//             // information from the form
//             beverageToEdit.name = editedBeverageFromForm.name;

//             // once we have edited the Beverage, save the user to the database
//             user.save(function (error, user) {
                
//                 // Once we have saved the user with its edited Beverage, redirect 
//                 // to the show page for that User. We should see the Beverage 
//                 // information updated.
//                 response.redirect('/users/' + userId)
//             });

            
//         });
// });

module.exports = router;
