const SlackBot = require("slackbots");
const Royale = require("./Royale.js");

// TODO:
// set channel topic to rule
// finish rules
// scoreboard
// maybe shouldn't create new instances for each game start
// round end warning

let games = {};
let channels;

const bot = new SlackBot({
  token: "xoxb-113239146807-594983095254-4AVm4ZmUZJpffks7fGLF5no1",
  name: "Slack Royale"
});

const defaults = {
  initialTime: 60,
  loop: false
};

// Start Handler
bot.on("start", () => {
  bot.getChannels().then(result => {
    channels = result.channels;
  });
});

bot.on("message", msg => {
  if (msg.text && msg.text.substr(0, 12) === "<@UHGUX2T7G>") {
    let command = msg.text
      .toLowerCase()
      .substr(13)
      .trim()
      .split(" ");

    let channelName = channels.find(channel => channel.id === msg.channel).name;
    switch (command[0]) {
      case "begin":
        if (games[msg.channel]) games[msg.channel].stop();
        games[msg.channel] = new Royale(
          bot,
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
