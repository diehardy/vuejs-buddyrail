const Router = require("express");
const router = new Router();
const controller = require("./controller");
const passport = require("passport");


router.get("/get-applications",controller.getApplications);
router.get("/get-input-data", controller.getInputData);
router.get("/check-last-application", controller.isAuthenticated, controller.checkLastApplication);

router.post("/add-application", controller.isAuthenticated, controller.addApplication);

router.get("/discord/", passport.authenticate('discord'), (req, res)=> {
res.send(200)
});

router.get("/discord/auth/redirect", passport.authenticate('discord'), controller.discordRedirect);

router.get('/is-authenticated', controller.isAuthenticated, controller.returnUser)

router.get('/get-analytics', controller.getAnalytics)
router.post('/get-user-applications', controller.isAuthenticated, controller.getUserApplications)

router.post('/delete-application', controller.isAuthenticated, controller.deleteApplication)



module.exports = router;