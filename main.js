/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** {brackets-jade} Jade Syntax Highlighting for Brackets 
    Provides jade syntax highlight via a CodeMirror mode for Brackets. 
*/

define(function (require, exports, module) {
    'use strict';

    console.log("Start Jade Syntax Highlighting Extension2");

    var LanguageManager = brackets.getModule("language/LanguageManager");

    var symbol_regex1 = /^(?:~|!|%|\^|\*|\+|=|\\|:|;|,|\/|\?|&|<|>|\|)/;
    var open_paren_regex = /^(\(|\[)/;
    var close_paren_regex = /^(\)|\])/;
    var keyword_regex1 = /^(if|else|return|var|function|include|doctype)/;
    var keyword_regex2 = /^(#|{|}|\.|each|in)/;
    var html_regex1 = /^(html|head|title|meta|link|script|body|br|div|input|span|a|img)/;
    var html_regex2 = /^(h1|h2|h3|h4|h5|p|strong|em)/;
    var whitespace = /^(\s)/;
    
    CodeMirror.defineMode("jade", function () {
        return {
            startState: function () {
                return {
                    inString: false,
                    stringType: "",
                    beforeTag: true,
                    justMatchedKeyword: false,
                    afterParen: false
                };
            },
            token: function (stream, state) {
                //check for state changes
                if (!state.inString && ((stream.peek() == '"') || (stream.peek() == "'"))) {
                    state.stringType = stream.peek();
                    stream.next(); // Skip quote
                    state.inString = true; // Update state
                }

                //return state
                if (state.inString) {
                    if (stream.skipTo(state.stringType)) { // Quote found on this line
                        stream.next(); // Skip quote
                        state.inString = false; // Clear flag
                    } else {
                        stream.skipToEnd(); // Rest of line is string
                    }
                    state.justMatchedKeyword = false;
                    return "string"; // Token style
                } else if(stream.sol()) {
                    stream.eatSpace();
                    if(stream.match(keyword_regex1)) {
                        state.justMatchedKeyword = true;
                        return "keyword";
                    }
                    if(stream.match(html_regex1) || stream.match(html_regex2)) {
                        state.justMatchedKeyword = true;
                        return "variable";
                    }
                    return null;   
                } else if(stream.match(symbol_regex1)) {
                    state.justMatchedKeyword = false;
                    return "atom";
                } else if(stream.match(open_paren_regex)) {
                    state.afterParen = true;
                    state.justMatchedKeyword = true;
                    return "def";
                } else if(stream.match(close_paren_regex)) { 
                    state.afterParen = false;
                    state.justMatchedKeyword = true;
                    return "keyword";
                } else if(stream.match(keyword_regex2)) {
                    state.justMatchedKeyword = true;
                    return "keyword";
                } else if(stream.match(whitespace)) {
                    console.log("whitespace");
                    state.justMatchedKeyword = false;
                    return null;
                }else {
                    var ch = stream.next();
                    if(state.justMatchedKeyword){
                        return "property";
                    } else if(state.afterParen) {
                        return "property";
                    }
                    return null;
                }
            }
        };
    });

LanguageManager.defineLanguage("jade", {
    name: "Jade",
    mode: "jade",
    fileExtensions: ["jade"],
    blockComment: ["{-", "-}"],
    lineComment: ["--"]
});

console.log("End Jade Highlighting2");

});