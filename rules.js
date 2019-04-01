const rules = [
  {
    description: `no caps`,
    test: msg => msg === msg.toLowerCase(),
    examples: {
      true: ["this sentence has no caps at all!"],
      false: ["But this is a regular sentence, Dan"]
    }
  },
  {
    description: `ALL CAPS`,
    test: msg => msg === msg.toUpperCase(),
    examples: {
      true: ["THIS SENTENCE IS IN ALL CAPS!"],
      false: ["thiS SENTENCE has mIXEd caps!"]
    }
  },
  {
    description: `nospaces`,
    test: msg => msg === msg.replace(/\s+/g, ""),
    examples: {
      true: ["ThisSentenceDoesn'tHaveAnySpacesAtAll"],
      false: ["But this one does"]
    }
  },
  {
    description: `Must say 'dude'`,
    test: msg => msg.toLowerCase().includes("dude"),
    examples: {
      true: ["thanks, dude!", "dude, check your emails!"],
      false: ["Thanks, guy", "This is a random sentence"]
    }
  },
  {
    description: `Must say 'I love you'`,
    test: msg => msg.toLowerCase().includes("i love you"),
    examples: {
      true: ["I think I love you!"],
      false: ["So what am I so afraid of?"]
    }
  },
  {
    description: `I'm not racist, but...`,
    test: msg =>
      msg.toLowerCase().includes("i'm not racist, but") ||
      msg.toLowerCase().includes("im not racist, but") ||
      msg.toLowerCase().includes("im not racist but") ||
      msg.toLowerCase().includes("i'm not racist but"),
    examples: {
      true: ["so I'm not racist but I like cheese"],
      false: ["actually I'm kind of racist"]
    }
  },
  {
    description: `Actually...`,
    test: msg => msg.toLowerCase().substring(0, 8) === "actually",
    examples: {
      true: ["Actually, I am pretty snooty"],
      false: ["this is not the same thing, actually"]
    }
  },
  {
    description: `no punctuation`,
    test: msg => msg === msg.replace(/[^\w\s]|_/g, ""),
    examples: {
      true: ["This sentence has no punctuation"],
      false: ["Hi, this sentence has a shit-ton of punctuation!"]
    }
  },
  {
    description: `lasT letteR capitalizeD onlY (no punctuation)`,
    test: msg =>
      msg ===
      msg
        .toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/([a-zA-Z]+)?([a-zA-Z])( )*/g, function($0, $1, $2, $3) {
          return ($1 ? $1 : "") + $2.toUpperCase() + ($3 ? $3 : "");
        }),
    examples: {
      true: ["thiS iS A tesT", "hellO daN ivE beeN expectinG yoU"],
      false: ["this is a test", "Hello, Dan. I've been expecting you!"]
    }
  },
  {
    description: `First Letter Capitalized Only (no punctuation)`,
    test: msg =>
      msg ===
      msg
        .toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/([a-zA-Z])([a-zA-Z]+)?( )*/g, function($0, $1, $2, $3) {
          return $1.toUpperCase() + ($2 ? $2 : "") + ($3 ? $3 : "");
        }),
    examples: {
      true: ["This Is A Test", "Hello Dan Ive Been Expecting You"],
      false: ["this is a test", "Hello, Dan. I've Been Expecting You!"]
    }
  },
  {
    description: `No double let̸ters`,
    test: msg => msg.search(/([a-zA-Z])\1/g) === -1,
    examples: {
      true: ["this has no double leters"],
      false: ["this has no double letters"]
    }
  }
];

module.exports = rules;
