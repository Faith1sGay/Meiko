const Command = require('../base/command')
const Category = require('../base/category')

module.exports = class ServerInfo extends Command {
  constructor () {
    super({
      name: 'serverinfo',
      category: Category.type.INFO
    })
  }

  async execute (meiko, content, context) {
    const roleList = context.guild._sortedRoles
    let roles = roleList.map(r => r.name).reverse().join(', ')

    if (roles.size > 1019) {
      roles = roles.substring(0, 1019) + '...'
    }

    const createdAt = context.guild.createdAt.toISOString()
    const embed = new meiko.Discord.MessageEmbed()
      .setAuthor('Server Information', context.guild.iconURL)
      .setDescription(`Server information embed for ${context.guild.name}`)
      .setThumbnail(context.guild.iconURL)
      .addField('ID', context.guild.id, false)
      .addField('Owner', context.guild.owner.user.tag)
      .addField('Users (Total/Online)', context.guild.members.cache.size + '/' + context.guild.members.cache.filter(m => m.presence.status !== 'offline').size, true)
      .addField('Channels (Text/Voice)',
        context.guild.channels.cache.filter(c => c.type === 'text').size + '/' + context.guild.channels.cache.filter(c => c.type === 'voice').size, true)
      .addField('Region', context.guild.region, true)
      .addField('Created', createdAt.substring(0, createdAt.indexOf('T')), true)
      .addField('Roles', roles, false)

    await context.channel.send({ embed })
  }
}
