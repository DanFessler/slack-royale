# slack-royale
Compete to be the last player standing in the Battle Royale that plays right inside your slack channels.

## About
+ Each round a new rule is chosen at random.
+ Any message that does not adhere to the rule will result in that player being eliminated from the game.
+ At the end of each round, any inactive players are eliminated.
+ The next round begins with each getting shorter until there's only one player left.

## Rules
+ no caps
+ ALL CAPS
+ nospaces
+ Must say 'dude'
+ Must say 'I love you'
+ Actually...
+ no punctuation
+ lasT letteR capitalizeD onlY
+ First Letter Capitalized Only
+ No double let̸ters

# Usage
+ **Install bot app to your slack workspace**
+ **copy config_template.json to config.json and fill in your credentials**
+ **Invite the bot to the channel you'd like to play in.**  
It's best to choose a channel that naturally has a lot of chatter, but isn't super important like **#random**
+ **Begin a match by typing "@slack_royale begin"**  
optional parameters, separated by spaces, are available: **initialTimer** (minutes), **loop** (bool)
+ **Force quite a match by typing "@slack_royale end"**
