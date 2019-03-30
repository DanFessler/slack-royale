const SlackBot = require("slackbots");
const axios = require("axios");

const bot = new SlackBot({
  token: "xoxb-113239146807-594983095254-4AVm4ZmUZJpffks7fGLF5no1",
  name: "Slack Royale"
});

const rules = [
  { description: `no caps`, test: msg => msg === msg.toLowerCase() },
  { description: `ALL CAPS`, test: msg => msg === msg.toUpperCase() },
  { description: `nospaces`, test: msg => msg === msg.replace(/\s+/g, "") },
  {
    description: `Must say 'dude'`,
    test: msg => msg.toLowerCase().includes("dude")
  },
  {
    description: `Must say 'I love you'`,
    test: msg => msg.toLowerCase().includes("i love you")
  },
  {
    description: `I'm not racist, but...`,
    test: msg =>
      msg.toLowerCase().includes("i'm not racist, but") ||
      msg.toLowerCase().includes("im not racist, but") ||
      msg.toLowerCase().includes("im not racist but") ||
      msg.toLowerCase().includes("i'm not racist but")
  }
  // { description: `no punctuation`, test: msg => true },
  // { description: `lasT letteR capitalizeD onlY`, test: () => true },
  // { description: `camelCase`, test: msg => true },
  // { description: `PascalCase`, test: msg => true },
  // { description: `No double leters`, test: msg => true },
  // original words only
];

let players = [];
let channel = "slackroyale";
let initialTime = 0.1 * 60 * 1000;
let timer;
let gameState;
let loop = false;
let restartTimer = 10000;

// Start Handler
bot.on("start", () => {
  bot.getChannel(channel).then(data => {
    channel = data;
    // startRound();
  });
});

bot.on("message", msg => {
  if (gameState && gameState.playing) {
    checkMessage(msg, gameState.rule);
  } else {
    if (msg.text && msg.text.substr(0, 12) === "<@UHGUX2T7G>") {
      let command = msg.text
        .toLowerCase()
        .substr(13)
        .trim()
        .split(" ");

      switch (command[0]) {
        case "begin":
          startRound(command[1], command[2]);
          break;
        case "initialTime":
          initialTime = command[1] * 60 * 1000;
          break;
        case "end":
          post("Game forcefully ended");
          gameState.playing = false;
          break;
        case "loop":
          loop = command[1] === "true";
          post(`The game will ${!loop ? "not " : ""}restart automatically`);
          break;
      }
    }
  }
});

function post(msg, params) {
  return bot.postMessageToChannel(channel.name, msg, params);
}

function getRandom(max) {
  min = 0;
  max = Math.floor(max) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startRound(time, shouldLoop) {
  initialTime = time !== undefined ? time * 60 * 1000 : initialTime;
  loop = shouldLoop !== undefined ? shouldLoop === "true" : loop;
  players = getPlayers(bot.getUsers()._value.members);
  gameState = {
    timer: initialTime,
    playing: true,
    rule: rules[getRandom(rules.length)]
  };
  post(
    `*The Slack Royale has begun!*\n circle closes in ${gameState.timer /
      1000 /
      60} minutes\n rule: ${gameState.rule.description}`,
    { icon_emoji: ":alert:" }
  );
  setTimeout(purgePlayers, gameState.timer); // M*S*Ms
}

function purgePlayers() {
  if (!gameState.playing) return;
  let playersString = "";

  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    if (!player.moved) {
      player.purge = true;
      playersString += `<${player.name}> died outside the playzone\n`;
    }
  }

  players = players.filter(player => player.purge !== true);
  players.forEach(player => (player.moved = false));

  gameState.timer = Math.max(
    Math.ceil(gameState.timer / 1000 / 2) * 1000,
    1000
  );
  post(playersString).then(() => {
    if (!checkEnd()) {
      let string = `${players.length} players remain. `;

      if (gameState.timer >= 60000) {
        string += `Next circle in ${gameState.timer / 1000 / 60} minutes!`;
      } else {
        string += `Next circle in ${gameState.timer / 1000} seconds!`;
      }

      post(string);

      setTimeout(purgePlayers, gameState.timer);
    }
  });
}

function checkEnd() {
  if (players.length > 1) {
    return false;
  } else {
    let looptext = loop
      ? `\nNext match begins in ${restartTimer / 1000} seconds`
      : "";
    if (players.length === 1) {
      gameState.playing = false;
      post(`<@${players[0].id}> WINNER WINNER CHICKEN DINNER! ${looptext}`);
    } else if (players.length === 0) {
      gameState.playing = false;
      post(`No one wins! ${looptext}`);
    }
    if (loop) setTimeout(startRound, restartTimer);
    return true;
  }
}

function checkMessage(msg, rule) {
  let player = getPlayer(msg.user);
  if (msg.type === "message" && msg.channel === channel.id && player) {
    console.log(msg);
    if (!rule.test(msg.text)) {
      players = players.filter(player => player.id !== msg.user);
      post(`<@${player.id}> has been eliminated!`);
      if (!checkEnd()) {
        post(`${players.length} players remaining`);
      }
    } else {
      player.moved = true;
      console.log("MOVED", players);
    }
  }
}

function getPlayer(userid) {
  return players.find(player => player.id === userid);
}

function getPlayers(users) {
  return users
    .filter(
      user => user.is_bot === false && channel.members.includes(user.id) // or bots // or anyone outside the specified channel
    )
    .map(user => {
      return {
        id: user.id,
        name: user.profile.display_name ? user.profile.display_name : user.name,
        moved: false
      };
    });
}
