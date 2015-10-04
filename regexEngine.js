var regexEngine = function(regex, string) {
  // Since JavaScript doesn't support pointer arithmetic, we mimic
  // that behavior using counter variables which indicate which position
  // in the array we want to be referencing at each step in the recursion
  regexCounter = 0;
  stringCounter = 0;

  function match() {
    // If regex starts with ^ then string must begin with match of remainder of expression
    if (regex[0] === '^') {
      // If regex matches starting with first character, this will return true
      // Otherwise it will return false
      return matchHere(regexCounter+1, stringCounter);
    }
    // Else, walk through string and check to see if string match beginning of expression at each point in string
    // This is an example of backtracking. If the regex doesn't match at this point in the string, the next
    // character in the string will be consumed and the regex will be checked again starting at that point.
    for (var i = 0; i < string.length; i++) {
      if (matchHere(regexCounter, stringCounter + i)) {
        return true;
      }
    }
    // If the regex can't be matched starting at any point in the string, return false
    return false;
  }

  // Variable shadowing --- Again, replacement for pointer arithmetic
  function matchHere(regexCounter, stringCounter) {
    // If we reach the end of the regex pattern, we've found a match
    if (regexCounter === regex.length) {
      return true;
    }
    // Handle * case
    if (regex[regexCounter + 1] === '*') {
      return matchStar(regex[regexCounter], regexCounter + 2, stringCounter);
    }
    // Handle + case
    if (regex[regexCounter + 1] === '+') {
      return matchPlus(regex[regexCounter], regexCounter + 2, stringCounter);
    }
    // If the current regex char specfies the end of the string then return true or false depending on whether we've reached the end of the string
    if (regex[regexCounter] === '$' && regexCounter === regex.length -1) {
      return stringCounter === string.length;
    }
    // If we're not at the end of the string and the regular expression character is a wildcard or the same as the string character, continue recursing
    if (stringCounter !== string.length && (regex[regexCounter] === '.' || regex[regexCounter] === string[stringCounter])) {
      return matchHere(regexCounter + 1, stringCounter + 1);
    }
    // If all else fails, return false. No match.
    return false;
  };

  // This is a lazy (non-greedy) implementation of matchStart. This means that matchStart will attempt to match the minimum number of characters
  // possible, as opposed to greedily matching as many as possible. There is no difference in the final output between using greedy and non-greedy
  // matching, but it will alter how fast the regex-engine runs on certain inputs based on the amount of backtracking that needs to occur.
  function matchStar(starChar, regexCounter, stringCounter) {
    // Lazy (non-greedy) implementation of star. Since the minimum number of characters a start can match is 0, can immediately check if regex
    // matches from this point onward, return true since the * does not need to consume any characters.
    if (matchHere(regexCounter, stringCounter)) {
      return true;
    };
    // If consuming 0 characters fails, consume one character and check, then continue consuming a character and checking if the regex pattern
    // matches until there are no more characters to consume.
    stringCounter++;
    while (stringCounter !== string.length && (string[stringCounter] === starChar || starChar === '.')) {
      if (matchHere(regexCounter, stringCounter)) {
        return true;
      }
      stringCounter++;
    }
    // If the regex pattern was never able to match return false
    return false;
  };

  // This is a greedy implementation of plus. It will match / consume as many character as possible. If matching the regex pattern after it has coonsumed
  // as many characters as possible fails, then it will relinquish a character and try again, repeating this process until only one character remains. If 
  // the regex still fails to match at that point, then it will return false.
  function matchPlus(plusChar, regexCounter, stringCounter) {
    // Count for keeping track of how many characters have been matched. Minimum is 1 for plus to be successful.
    var numFound = 0;
    // If the first character doesn't match (and we're not using a . to match all characters) then return false
    if (string[stringCounter] !== plusChar && plusChar !== '.') {
      return false;
    }
    // This is where the greediness happens. Keep incrementing stringCounter (equivalent to consuming a character) until the character no longer matches
    while (string[stringCounter] === plusChar || (plusChar === '.' && stringCounter !== string.length)) {
      stringCounter++;
      numFound++;
    }
    // After greedily consuming all the characters, check if the regamining regex/string combination matches.
    if (matchHere(regexCounter, stringCounter) && numFound >= 1) {
      return true;
    }
    // If it doesn't match, then relinquish a character and try again. Continue doing so until a match is found, or all characters (except one) have 
    // been relinquished. If only one character remains and the pattern has not matched, then return false as plus requires at least one character match.
    else {
      stringCounter--;
      numFound--;
      while (string[stringCounter] === plusChar || (plusChar === '.' && stringCounter !== string.length && stringCounter !== 0)) {
        if (matchHere(regexCounter, stringCounter) && numFound >= 1) {
          return true;
        }
        stringCounter--; 
        numFound--;
      }
      return false;
    }
  };

  // This function is for instruction only, it shows what a lazy (non-greedy) implementation of match plus would look like. It handles certain pathological
  // regex patterns / string combinations (like regex: a+a+a+a+a+a+a+a+ and string: aaaaaaaaaaaaaaaaaaaaaab) much more efficiently
  function matchPlusLazy(plusChar, regexCounter, stringCounter) {
    var numFound = 0;
    if (string[stringCounter] !== plusChar && plusChar !== '.') {
      return false;
    }
    // This is lazy (non-greedy) implementation. It consumes on character only, then tries to match the remaining regex / string. If that fails, it then consumes
    // another token. Rinse and repeat until it reaches the end of the string.
    while (string[stringCounter] === plusChar || (plusChar === '.' && stringCounter !== string.length)) {
      stringCounter++;
      numFound++;
      if (matchHere(regexCounter, stringCounter) && numFound >= 1) {
        return true;
      }
    }

    // Return false if it never matches
    return false;
  };

  return match();
}

// Simple testing functionality
var tester = {
  numAssertions: 0,
  numSuccessful: 0,
  runTest: function(regex,string, result) {
    this.numAssertions++;
    if (regexEngine(regex, string) === result) {
      this.numSuccessful++;
    }
  },
  finishTests: function() {
    console.log('Tests complete: ' + this.numSuccessful + '/' + this.numAssertions + ' assertions successful');
  }
};

tester.runTest('a','a', true);
tester.runTest('a', 'b', false);
tester.runTest('ab', 'ab', true);
tester.runTest('ab', 'abc', true);
tester.runTest('ab$', 'abc', false);
tester.runTest('^dab', 'dabb', true);
tester.runTest('a*b', 'b', true);
tester.runTest('a*b', 'ab', true);
tester.runTest('a*b', 'aaaaab', true);
tester.runTest('a*b', 'a', false);
tester.runTest('a+', 'a', true);
tester.runTest('a+', 'ab', true);
tester.runTest('a+', 'b', false);
tester.runTest('a+', '', false);
tester.runTest('.*ab', 'asdfadsab', true);
tester.runTest('.*ab', 'ab', true);
tester.runTest('.*ab', 'absdfadsfa', true);
tester.runTest('.+ab', 'asdfadsab', true);
tester.runTest('.+ab', 'ab', false);
tester.runTest('.+ab', 'absdfadsfa', false);
tester.runTest('.+ab', 'aab', true);
tester.runTest('d+a+bb', 'dabb', true);
tester.runTest('d+a+abb', 'dabb', false);
tester.runTest('d+a+a*bb', 'dabb', true);
tester.runTest('d+a+a*bb', 'daaaaaabb', true);

// Example of a pathological regex / string combination that causes a LOT of backtracking with the greedy plus character, potentially crashes browser in some cases.
// However if its run with the lazy version of matchPlus, it executes extremely quickly.
// tester.runTest('a+a+a+a+a+a+a+a+a+', 'aaaaaaaaaaaaaaaaaaaaaab', true);

tester.finishTests();