const SlackBot = require("slackbots");
const Royale = require("./src/Royale.js");
const config = require("./config.json");

// TODO:
// set channel topic to rule (probably needs different API)
// scoreboard
// round end warning
// clamp round timer to minutes, not seconds
// shorter rounds?
// escape emotes?
// make new rule more visible

// IDEA:
// attacking players
// emote rule
// lazy elimination
// resource emotes
// giphy round

let games = {};
let channels;

const bot = new SlackBot(config);

const defaults = {
  initialTime: 60,
  loop: false
};

bot.on("start", () => {
  bot.getChannels().then(result => {
    channels = result.channels;
  });
});

bot.on("message", msg => {
  if (msg.text && msg.text.substr(0, 12) === `<@${config.botId}>`) {
    let channelName = channels.find(channel => channel.id === msg.channel).name;

    let command = msg.text
      .toLowerCase()
      .substr(13)
      .trim()
      .split(" ");

    switch (command[0]) {
      case "begin":
        if (games[msg.channel]) games[msg.channel].stop();
        games[msg.channel] = new Royale(
          bot,
          botId,
          channelName,
          command[1] !== undefined ? command[1] : defaults.initialTime,
          command[2] !== undefined ? command[2] : defaults.loop
        );
        break;
      case "end":
        if (games[msg.channel]) {
          games[msg.channel].stop();
        }
        break;
      // who's alive?
      // what's the score?
      // how much time remaining?
    }
  }
});
