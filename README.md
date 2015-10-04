# Simple Regex Engine in JavaScript (Backtracking Algorithm)

**Note:** This README is relatively brief because the source code is verbosely documented.

This is a simple implementation of a regex engine in JavaScript that uses a traditional "backtracking" algorithm to match regular expression patterns against strings. The engine handles the following special regular expression characters:

1. ^ Beginning of string
2. $ End of string
3. * Match previous expression 0 or more times
4. + Match previous expression 1 or more times

This code was written to learn about how backtracking regular expresssion engines work (as such its heavily commented), as well as how certain toxic regular expression / string combinations can cause backtracking engines to take exponential time to determine if a match exists. It started off as being a simple translation of the C program specified in Resources[2], however, I modified it to include extra functionality such as handling the + character, as well as a simple testing suite.

## Next Steps

At some point, I'd like to return to this project and implement a non-recursive NFA/DFA solution, however, I have to finish writing my hack compiler first :)

## Resources:

1. https://swtch.com/~rsc/regexp/regexp1.html
2. http://www.ddj.com/architect/184410904 --- Simple backtracking algorithm implemented in C
3. http://www.codeproject.com/Articles/5412/Writing-own-regular-expression-parser --- For when I decide to write the NFA/DFA solution
4. http://www.regular-expressions.info/