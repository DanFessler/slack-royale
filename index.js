const SlackBot = require("slackbots");
const Royale = require("./Royale.js");

let games = {};
let channels;

const bot = new SlackBot({
  token: "xoxb-113239146807-594983095254-4AVm4ZmUZJpffks7fGLF5no1",
  name: "Slack Royale"
});

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

    switch (command[0]) {
      case "begin":
        // startRound(command[1], command[2]);
        let name = channels.find(channel => channel.id === msg.channel).name;
        games[msg.channel] = new Royale(name, 0.25, true);
        break;
      // case "initialTime":
      //   initialTime = command[1] * 60 * 1000;
      //   break;
      // case "end":
      //   post("Game forcefully ended");
      //   gameState.playing = false;
      //   break;
      // case "loop":
      //   loop = command[1] === "true";
      //   post(`The game will ${!loop ? "not " : ""}restart automatically`);
      //   break;
    }
  }
});
