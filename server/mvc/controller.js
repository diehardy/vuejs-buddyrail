const { response } = require("express");
const Package = require("./package")
const router = require("./router")
const path = require('path')

require("dotenv").config({path: path.resolve(__dirname, '../.env')});

class qualityController {


    isAuthenticated = async (req, res, next) => {

        if (req.isAuthenticated()) {
            // console.log('user is', req.user);
            res.locals.user = await Package.getUser(req.user);
            if(res.locals.user[0].is_banned) {return res.status(401).send('Banned');}
            await Package.updateLastActivity(req.user, new Date())
            // console.log('locals:', res.locals.user);
            return next();
        }
        
        res.status(401).send('Unauthorized');
    };
    returnUser = async(req,res) => {
        return res.status(200).json(res.locals.user[0])
    }

    
    async checkLastApplication(req, res) {
        try {
            const lastApplication = await Package.getLastApplication(res.locals.user[0].id_user)
            console.log(lastApplication[0])
            if(lastApplication[0]) {
                console.log('enter');
                const hoursToAdd = 1 /* <- 1hour*/ * 60 * 60 * 1000;
                const datePlusHour = new Date(lastApplication[0].date_created);
                datePlusHour.setTime(datePlusHour.getTime() + hoursToAdd);
                if(datePlusHour < new Date()){
                    return res.status(200).json(false) 
                } else {
                    return res.status(200).json(true)}
            } else {return res.status(200).json(false)}

        }
        catch (error) {
            console.log('checkLastApplication error: ', error);
            return res.status(500).json({ message: "Error occurred." })
        }
    }
    async addApplication(req, res) {
        try {
            const {isAuthorized, isMic, games, languages, message, buddyMicrophone} = req.body
            

            if(res.locals.user[0].is_banned) {return res.status(401).send('Banned');}
            const dateCreated = new Date()
            const lastApplication = await Package.getLastApplication(res.locals.user[0].id_user)
            

            if(lastApplication[0]) {
                const hoursToAdd = 1 /* <- 1hour*/ * 60 * 60 * 1000;
                const datePlusHour = new Date(lastApplication[0].date_created);
                datePlusHour.setTime(datePlusHour.getTime() + hoursToAdd);
                if(datePlusHour < new Date()){
                    await Package.addApplication(isAuthorized, isMic, games, languages, dateCreated, message, buddyMicrophone, res.locals.user[0].id_user)
                    return res.status(200).json({ message: 'Application has been added.' })
                } else {
                    console.log('you have to wait for an hour!');
                    return res.status(200).json({ message: 'You can create only 1 application per hour.' })
                }
            } else {
                await Package.addApplication(isAuthorized, isMic, games, languages, dateCreated, message, buddyMicrophone, res.locals.user[0].id_user)
                return res.status(200).json({ message: 'Application has been added.' })
            }

        } catch (error) {
            console.log('addApplication error: ', error);
            return res.status(500).json({ message: "Error occurred." })
     
        }
    }


    // getting games and languages
    async getInputData(req, res) {
        try {
            let games = await Package.getGames()
            let languages = await Package.getLanguages()
            return res.status(200).json({ games, languages })
        } catch (error) {
            console.log('getInputDate error: ', error);
            return res.status(500).json({ message: "Error occurred." })
     
        }
    }

    
    async getAnalytics(req, res) {
        try {
            const totalUsers = await Package.getTotalUsers()
            const totalApplications = await Package.getTotalApplications()

            const startDay = new Date(new Date().setHours(0, 0, 0, 0))
            const endDay = new Date(new Date().setHours(23, 59, 59, 999))


            const dailyUsers = await Package.getDailyUsers(startDay, endDay)
            const dailyApplications = await Package.getDailyApplications(startDay, endDay)

            const getDailyActiveUsers = await Package.getDailyActiveUsers(startDay, endDay)

            return res.status(200).json({ totalUsers: totalUsers[0].count, totalApplications: totalApplications[0].count, dailyUsers: dailyUsers[0].count, dailyApplications: dailyApplications[0].count, dailyActiveUsers: getDailyActiveUsers[0].count })
        } catch (error) {
            console.log('getAnalytics error: ', error);
            return res.status(500).json({ message: "Error occurred." })
        }
    }


    async getApplications(req, res) {
        try {  

            let {isAuthorized, languages, games, isMic, buddyMicrophone, currentPage} = req.query
            if(currentPage == 0) {currentPage = 1}
            const maxApplications = 3;

            const applications = await Package.getApplications(isAuthorized, languages, games, isMic, buddyMicrophone, currentPage, maxApplications)
            let totalPages = await Package.countApplications(isAuthorized, languages, games, isMic, buddyMicrophone, currentPage, maxApplications)

            let discordProtectedApplications = await Package.countDiscordApplications();

            totalPages = Math.ceil(totalPages.length / maxApplications)
            const languagesFromDatabase = await Package.getLanguages()
            const gamesFromDatabase = await Package.getGames()

            const filteredApplications = applications.map((application)=> {
               let languagesSorted =  languagesFromDatabase.filter((elDb) => application.languages.includes(elDb.id_language))
               application.languages = languagesSorted

               let gamesSorted =  gamesFromDatabase.filter((elDb) => application.games.includes(elDb.id_game))
               application.games = gamesSorted
               
               return application
            })

            return res.status(200).json({ filteredApplications, totalPages, discordProtectedApplications: discordProtectedApplications[0].count })
        } catch (error) {
            console.log('getApplications error:', error);
            return res.status(500).json({ message: "Error occurred." })
        }
    }

    async getUserApplications(req, res) {
        try {
            console.log(res.locals.user[0]);
            let userApplications = await Package.getUserApplications(res.locals.user[0].id_user)

            const languagesFromDatabase = await Package.getLanguages()
            const gamesFromDatabase = await Package.getGames()



             userApplications = userApplications.map((application)=> {
                let languagesSorted =  languagesFromDatabase.filter((elDb) => application.languages.includes(elDb.id_language))
                application.languages = languagesSorted

                let gamesSorted =  gamesFromDatabase.filter((elDb) => application.games.includes(elDb.id_game))
                application.games = gamesSorted
                
                return application
             })


            return res.status(200).json({ userApplications })
        } catch (err) {
            console.log('getUserApplications err:', err);
            return res.status(500).json({ message: "Error occurred." })
        }
    }

    async deleteApplication(req, res) {
        try {
            const {idApplication} = req.body
            console.log('lets delete: ', idApplication, res.locals.user[0].id_user);
            await Package.deleteApplication(idApplication, res.locals.user[0].id_user)
            return res.status(200).json({ message: 'Application has been deleted.' })
        }
        catch(err) {
            console.log('deleting application err:', err);
            return res.status(500).json({ message: "Error occurred." })
        } 
    }

    async discordRedirect(req, res) {
        try {
            res.redirect(`${process.env.START_PAGE}`);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new qualityController();


