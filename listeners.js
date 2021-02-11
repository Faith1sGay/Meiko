const meiko = require('./meiko.js')
const prefix = meiko.config.prefix
const Category = require('./commands/base/category')

exports.listen = (client, utils) => {
  client.on('message', ctx => {
    if (ctx.channel.type === 'dm') { return } // Nope <3

    if (ctx.content.startsWith(prefix)) {
      const parts = ctx.content.slice(prefix.length).split(' ')
      const command = parts[0]
      const content = ctx.content.replace(prefix + command, '')
      meiko.timesCommandsRan++

      try {
        const executedCommand = meiko.commands.get(command)
        if (executedCommand === undefined) { return }

        if (executedCommand.category === Category.type.OWNER) {
          if (ctx.author.id !== meiko.config.ownerId) {
            ctx.channel.send(':warning: This command is owner-only!')
            return
          }
        }

        executedCommand.execute(meiko, content.trim(), ctx)
      } catch (err) {
        console.log(err)
      }
    }
  })

  client.on('ready', async () => {
    utils.simple(`Logged in. Visible Guilds: ${client.guilds.cache.size}, Users: ${client.users.cache.size} \o/`)
    utils.simple(`Loaded ${meiko.commands.size} commands!`)
    await client.user.setActivity('<3')
  })
}
