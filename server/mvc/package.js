const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
});



exports.addApplication = async (isAuthorized, isMic, games, languages, dateCreated, message, buddyMicrophone, id_user) =>
    knex("user_applications").insert({is_authorized: isAuthorized, is_mic: isMic, games: games, languages: languages, date_created: dateCreated, message: message, is_buddy_mic: buddyMicrophone, id_user})

exports.getApplications = async (isAuthorized, languages, games, isMic, buddyMicrophone, currentPage, maxApplications) => 
    knex("user_applications").select()
    .where((filter) => {
        filter.where('is_authorized', isAuthorized)
        if(languages && languages.length > 0) {
            filter.whereRaw(`languages && ARRAY[${languages}]::integer[]`)
        }
        if(games && games.length > 0) {
            filter.whereRaw(`games && ARRAY[${games}]::integer[]`)
        }
        if(isMic === 'true') {
            filter.whereIn('is_buddy_mic', ['Has microphone', 'Both'])
        } else {
            filter.whereIn('is_buddy_mic', ['No microphone', 'Both'])
        }
        if (buddyMicrophone === 'Has microphone') {
            filter.where('is_mic', true);
        } 
        if(buddyMicrophone === 'Both'){
            filter.whereIn('is_mic', [true,false]);
        }
        if(buddyMicrophone === 'No microphone') {
            filter.where('is_mic', false);
        }
        filter.where('is_banned', false)
      })
      .innerJoin('users', 'user_applications.id_user', '=', 'users.id_user')
      .orderBy('id_application', 'desc').offset((currentPage - 1) * maxApplications).limit(Number(maxApplications))



exports.countDiscordApplications = async () => knex("user_applications").select()
.count('id_application', 'discordProtectedApplications').where('is_authorized', true)


exports.countApplications = async (isAuthorized, languages, games, isMic, buddyMicrophone, currentPage, maxApplications) => 
    knex("user_applications").select()
    .where((filter) => {
        filter.where('is_authorized', isAuthorized)
        if(languages && languages.length > 0) {
            filter.whereRaw(`languages && ARRAY[${languages}]::integer[]`)
        }
        if(games && games.length > 0) {
            filter.whereRaw(`games && ARRAY[${games}]::integer[]`)
        }
        if(isMic === 'true') {
            filter.whereIn('is_buddy_mic', ['Has microphone', 'Both'])
        } else {
            filter.whereIn('is_buddy_mic', ['No microphone', 'Both'])
        }
        if (buddyMicrophone === 'Has microphone') {
            filter.where('is_mic', true);
        }
        if(buddyMicrophone === 'Both'){
            filter.whereIn('is_mic', [true,false]);
        }
        if(buddyMicrophone === 'No microphone') {
            filter.where('is_mic', false);
        }
        filter.where('is_banned', false)
        })
    .innerJoin('users', 'user_applications.id_user', '=', 'users.id_user')
    .count('id_application', 'totalPages')
    .groupBy('id_application')

exports.getLastApplication = async (id_user) => knex("user_applications").select().orderBy('date_created', 'desc').limit(1).where('id_user', id_user);

exports.getGames = async () => knex("games").select().orderBy('order');
exports.getLanguages = async () => knex("languages").select();

exports.getTotalUsers = async () => knex("users").select().count('id_user');
exports.getTotalApplications = async () => knex("user_applications").select().count('id_application');
exports.getDailyUsers = async (startDate, endDate) => knex("users").select()
.whereBetween('registration_date', [startDate, endDate])
.count('id_user');


exports.getDailyApplications = async (startDate, endDate) => knex("user_applications").select()
.whereBetween('date_created', [startDate, endDate])
.count('id_application');

exports.getDailyActiveUsers = async (startDate, endDate) => knex("users").select()
.whereBetween('last_activity', [startDate, endDate])
.count('id_user');

exports.getUsers = async () => knex("users").select().count('id_user');



exports.addUser = async (id_discord,avatar, username, registration_date) =>
    knex("users").insert({id_discord,avatar, username, registration_date, is_banned: false}).returning(['id_discord', 'id_user', 'is_banned'])

exports.getUser = async (idUser) =>
    knex("users").select().where('id_discord', idUser)

exports.getUserApplications = async (idUser) =>
    knex("user_applications").select().where('user_applications.id_user', idUser).orderBy('date_created', 'desc').innerJoin('users', 'user_applications.id_user', '=', 'users.id_user')


exports.updateUser = async (id_discord,avatar, username, last_activity) =>
    knex("users").update({avatar, username, last_activity}).where('id_discord', id_discord)

exports.updateLastActivity = async (id_discord, date) =>
    knex("users").update({last_activity: date}).where('id_discord', id_discord)




exports.deleteApplication = async (idApplication, idUser) =>
    knex("user_applications").delete().where('id_application', idApplication).andWhere('id_user', idUser)



