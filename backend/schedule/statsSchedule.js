const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.database('users')
            .whereNull('deleted_at').count('id').first()
        const categoriesCount = await app.database('categories')
            .count('id').first()
        const articlesCount = await app.database('articles')
            .count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {},
            { sort: { 'created_at' : -1 } })

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            created_at: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles

        if(changeUsers || changeCategories || changeArticles) {
            stat.save().then(() => console.log('[Stats] Estatíticas atualizadas!'))
        }
    })
}