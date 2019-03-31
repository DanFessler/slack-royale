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

module.exports = rules;
