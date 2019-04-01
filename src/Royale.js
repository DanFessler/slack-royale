const rules = require("./rules.js");

class Royale {
  constructor(bot, channelName, initialTime, loop) {
    console.log("Constructing new battle royale");

    this.bot = bot;
    this.listen = this.listen.bind(this);
    this.purgePlayers = this.purgePlayers.bind(this);
    this.startRound = this.startRound.bind(this);

    this.channelName = channelName;
    this.loop = loop !== undefined ? loop : true;
    this.initialTime =
      (initialTime !== undefined ? initialTime : 1) * 60 * 1000; // minutes
    this.restartTimer = 10000;
    this.playing = false;

    // Set up round, then begin listening for messages
    this.startRound(() => {
      this.bot.on("message", this.listen);
    });
  }

  listen(msg) {
    this.filterMessage(msg, msg => this.handleMessage(msg));
  }

  startRound(callback) {
    console.log("Start");

    return this.bot
      .getChannel(this.channelName)
      .then(channel => {
        this.channel = channel;
        return this.bot.getUsers();
      })
      .then(users => {
        this.players = this.filterPlayers(users.members);
        this.rule = this.newRule();
        this.playing = true;
        this.timer = this.initialTime;

        return this.bot.postMessageToChannel(
          this.channelName,
          // prettier-ignore
          `*The Slack Royale has begun!*\n Round ends in ${this.timer / 1000 / 60} minutes\n rule: ${this.rule.description}`,
          { icon_emoji: ":alert:" },
          () => {
            if (this.purgeTimeout) clearTimeout(this.purgeTimeout);
            this.purgeTimeout = setTimeout(this.purgePlayers, this.timer);
          }
        );
      })
      .then(result => callback());
  }

  newRule() {
    return rules[Math.floor(Math.random() * Math.floor(rules.length))];
  }

  stop() {
    this.bot.postMessageToChannel(this.channelName, "Game forcefully ended");
    clearTimeout(this.purgeTimeout);
    clearTimeout(this.startTimeout);
    this.bot.removeListener("message", this.listen);
  }

  handleMessage(msg) {
    let player = this.getPlayer(msg.user);
    if (!player) return;

    if (this.rule.test(msg.text)) {
      player.moved = true;
    } else {
      // Remove player if test failed
      this.players = this.players.filter(player => player.id !== msg.user);

      // Calculate string for remaining players
      let remainingString =
        this.players.length > 0
          ? `\n${this.players.length} players remaining`
          : "";

      // Post update to channel and check for end condition
      this.bot
        .postMessageToChannel(
          this.channelName,
          `<@${player.id}> has been eliminated! ${remainingString}`
        )
        .then(() => this.checkEnd());
    }
  }

  filterMessage(msg, callback) {
    if (
      msg.type === "message" &&
      msg.channel === this.channel.id &&
      msg.user &&
      this.getPlayer(msg.user) &&
      !msg.text.includes("<@UHGUX2T7G>")
    ) {
      callback(msg);
    }
  }

  purgePlayers() {
    console.log("Purging", this.timer);

    // Exit early if we've already determined the game has ended elsewhere
    if (!this.playing) return;

    // Mark players to be purged and build up post string
    let deathReport = "";
    this.players.forEach(player => {
      if (!player.moved) {
        player.purge = true;
        deathReport += `<@${player.name}> was eliminated for inactivity\n`;
      } else {
        // Mark players to unsafe again
        player.moved = false;
      }
    });

    // Removed players marked for purging
    this.players = this.players.filter(player => player.purge !== true);

    // Decrease circle timer
    this.timer = Math.max(Math.ceil(this.timer / 1000 / 2) * 1000, 1000);

    // Post death report
    this.bot.postMessageToChannel(this.channelName, deathReport).then(() => {
      if (!this.checkEnd()) {
        this.bot.postMessageToChannel(
          this.channelName,
          `${this.players.length} players remain. Round ends in ${
            this.timer >= 60000
              ? this.timer / 1000 / 60 + "minutes"
              : this.timer / 1000 + "seconds"
          }!`
        );
        this.rule = this.newRule();
        this.purgeTimeout = setTimeout(this.purgePlayers, this.timer);
      }
    });
  }

  checkEnd() {
    console.log("Check end");

    if (this.players.length > 1) return false;

    let looptext = this.loop
      ? `\nNext game begins in ${this.restartTimer / 1000} seconds`
      : "";

    // Post who won
    if (this.players.length === 1) {
      this.bot.postMessageToChannel(
        this.channelName,
        `<@${this.players[0].id}> WINNER WINNER CHICKEN DINNER! ${looptext}`
      );
    } else {
      this.bot.postMessageToChannel(
        this.channelName,
        `No one wins! ${looptext}`
      );
    }

    this.playing = false;

    // Restart the game if loop was set to true
    if (this.loop)
      this.startTimeout = setTimeout(this.startRound, this.restartTimer);

    return true;
  }

  filterPlayers(users) {
    return users
      .filter(
        // exclude bots or anyone outside the specified channel
        user => user.is_bot === false && this.channel.members.includes(user.id)
      )
      .map(user => {
        // only include relevant data
        return {
          id: user.id,
          name: user.profile.display_name
            ? user.profile.display_name
            : user.name,
          moved: false
        };
      });
  }

  getPlayer(userId) {
    return this.players.find(player => player.id === userId);
  }
}

module.exports = Royale;
