const env = require('./.env');

const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const { Markup } = require('telegraf/extra');

const session = require('telegraf/session')
const bot = new Telegraf(env.TOKEN);

const buttons = list => Extra.markup(
  Markup.inlineKeyboard(
    list.map(item => Markup.callbackButton(item,`delete ${item}`)),
    { columns: 3 }
  )
);

bot.use(session())

bot.start(async content => {
  const name = content.update.message.from.first_name;

  await content.reply(`Seja Bem-vindo(a), ${name}`);
  await content.reply('Digite os produtos que seja adicionar ao carrinho');
  content.session.list = []
})

bot.on('text', content => {
  let message = content.update.message.text;
  content.session.list.push(message);
  content.reply(`${content.update.message.text} Produto adicionado`, buttons(content.session.list));
});

bot.action(/delete (.+)/, content => {
  content.session.list = content.session.list.filter(item => item !== content.match[1])
  content.reply(`${content.match[1]} deletado`, buttons(content.session.list));
});

bot.startPolling();