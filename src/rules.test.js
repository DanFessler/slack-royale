const rules = require("./rules.js");

// loops through all examples in the rules and tests them
rules.forEach(rule => {
  if (rule.examples) {
    test(rule.description, () => {
      rule.examples.true.forEach(example =>
        expect(rule.test(example)).toBe(true)
      );
      rule.examples.false.forEach(example =>
        expect(rule.test(example)).toBe(false)
      );
    });
  }
});
