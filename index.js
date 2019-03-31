const SlackBot = require("slackbots");
const Royale = require("./Royale.js");

// TODO:
// Currently there's no way to delete event listeners
// so I'll have to create singleton royale instances per channel
// and start and stop the game within the class rather than
// instantiate new instances for each game
// Another option is to externally pipe messages to all instances

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

    let name = channels.find(channel => channel.id === msg.channel).name;
    switch (command[0]) {
      case "begin":
        games[msg.channel] = new Royale(
          name,
          command[1] !== undefined ? command[1] : defaults.initialTime,
          command[2] !== undefined ? command[2] : defaults.loop
        );
        break;
      case "end":
        if (games[msg.channel]) {
          // bot.postMessageToChannel(name, "Game forcefully ended");
          // delete games[msg.channel];
          games[msg.channel].end();
        }
        break;
      // case "initialTime":
      //   initialTime = command[1] * 60 * 1000;
      //   break;
      // case "loop":
      //   loop = command[1] === "true";
      //   post(`The game will ${!loop ? "not " : ""}restart automatically`);
      //   break;
    }
  }
});
