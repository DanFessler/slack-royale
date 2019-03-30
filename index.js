const SlackBot = require("slackbots");
const axios = require("axios");

const bot = new SlackBot({
  token: "xoxb-113239146807-594983095254-0CfYk8rdnRaKNHaSTRVXny0Y",
  name: "Slack Royale"
});

const rules = [
  // { description: `no punctuation`, test: msg => true },
  { description: `no caps`, test: msg => msg === msg.toLowerCase() },
  { description: `ALL CAPS`, test: msg => msg === msg.toUpperCase() },
  { description: `nospaces`, test: msg => msg === msg.replace(/\s+/g, "") }
  // { description: `lasT letteR capitalizeD onlY`, test: () => true },
  // { description: `camelCase`, test: msg => true },
  // { description: `PascalCase`, test: msg => true },
  // { description: `Must say 'dude'`, test: msg => true },
  // { description: `Must say 'I love you'`, test: msg => true },
  // { description: `No double leters`, test: msg => true },
  // { description: `I'm not racist, but...`, test: msg => true }
  // original words only
];

// round start
// pick rule
// get fresh list of users
//   circle shrinks in x minutes
//   check message for rule
//     elimenate player
//   circle shrink warning
//   circle shrinked
//   check players for "movement"
//     eliminate players
//   timer shortens
// check last man

let players = [];
const channel = { user: false, name: "test" };

// Start Handler
bot.on("start", () => {
  var params = {
    icon_emoji: ":alert:"
  };
  // bot.postMessageToUser("danfessler", "ALERT!", params);
  // bot.postMessageToChannel("slackroyale", "ALERT!", params);

  players = getPlayers(bot.getUsers()._value.members);
  // console.log(players);

  startRound(players, rules[getRandom(rules.length)]);
});

const post = (msg, params) => {
  if (channel.user === true) {
    bot.postMessageToUser(channel.name, msg, params);
  } else {
    bot.postMessageToChannel(channel.name, msg, params);
  }
};

function getRandom(max) {
  min = 0;
  max = Math.floor(max) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const startRound = (players, rule) => {
  post(`The Slack Royale has begun! \nRULE: ${rule.description}`, {
    icon_emoji: ":alert:"
  });
  console.log(rule);
  bot.on("message", msg => checkMessage(msg, rule));
};

const checkMessage = (msg, rule) => {
  let player = getPlayer(msg.user);
  if (msg.type === "message" && player) {
    console.log(msg);
    if (!rule.test(msg.text)) {
      post(`${player.name} has been eliminated!`, {
        icon_emoji: ":alert:"
      });
    }
  }
};

const playerExists = userid => {
  return players.filter(player => player.id === userid).length > 0;
};

const getPlayer = userid => {
  return players.filter(player => player.id === userid)[0];
};

const getPlayers = users => {
  return users
    .filter(
      user =>
        user.deleted === false &&
        user.is_bot === false &&
        user.id !== "USLACKBOT"
    )
    .map(user => {
      return {
        id: user.id,
        name: user.profile.display_name ? user.profile.display_name : user.name,
        moved: false
      };
    });
};
