/*
 * Mentions Input
 * Version 1.0.3.dtime
 * Written by: Kenneth Auchenberg (Podio)
 * Forked  by: David Haslem (dtime, inc.)
 *
 * From: https://github.com/dtime/jquery-mentions-input
 * Using underscore.js
 *
 * License: MIT License - http://www.opensource.org/licenses/mit-license.php
 */

(function ($, _, undefined) {

  // Settings
  var KEY = { BACKSPACE : 8, TAB : 9, RETURN : 13, ESC : 27, LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40, COMMA : 188, SPACE : 32, HOME : 36, END : 35 }; // Keys "enum"
  var defaultSettings = {
    triggerChar   : '@',
    onDataRequest : $.noop,
    minChars      : 2,
    showAvatars   : true,
    elastic       : false,
    useCurrentVal : true,
    display       : 'name',
    defaultTriggerChar  : '',
    onCaret       : true,
    classes       : {
      autoCompleteItemActive : "active"
    },
    templates     : {
      wrapper                    : _.template('<div class="mentions-input-box"></div>'),
      autocompleteList           : _.template('<div class="mentions-autocomplete-list"></div>'),
      autocompleteListItem       : _.template('<li data-ref-id="<%= id %>" data-ref-type="<%= type %>" data-display="<%= display %>"><%= content %></li>'),
      autocompleteListItemAvatar : _.template('<img  src="<%= avatar %>" />'),
      autocompleteListItemIcon   : _.template('<div class="icon <%= icon %>"></div>'),
      mentionsOverlay            : _.template('<div class="mentions"><div></div></div>'),
      mentionItemSyntax          : _.template('[<%= value %>](<%= type %>:<%= id %>)'),
      mentionItemHighlight       : _.template('<strong><span><%= value %></span></strong>')
    }
  };

  var utils = {
    htmlEncode       : function (str) {
      return _.escape(str);
    },
    highlightTerm    : function (value, term) {
      if (!term && !term.length) {
        return value;
      }
      return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
    },

    getCaretPosition: function(el) {
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    },

    setCaretPosition : function (domNode, caretPos) {
      if (domNode.createTextRange) {
        var range = domNode.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if (domNode.selectionStart) {
          domNode.focus();
          domNode.setSelectionRange(caretPos, caretPos);
        } else {
          domNode.focus();
        }
      }
    },

    rtrim: function(string) {
      return string.replace(/\s+$/,"");
    }
  };

  var MentionsInput = function (settings) {

    var domInput, elmInputBox, elmInputWrapper, elmAutocompleteList, elmWrapperBox, elmMentionsOverlay, elmActiveAutoCompleteItem;
    var mentionsCollection = [];
    var autocompleteItemCollection = {};
    var inputBuffer = [];
    var currentDataQuery = '';

    settings = $.extend(true, {}, defaultSettings, settings );
    if(!_.isArray(settings.triggerChar)){
      settings.triggerChar = [settings.triggerChar];
    }

    function initTextarea() {
      elmInputBox = $(domInput);

      if (elmInputBox.attr('data-mentions-input') == 'true') {
        return;
      }

      elmInputWrapper = elmInputBox.parent();
      elmWrapperBox = $(settings.templates.wrapper());
      elmInputBox.wrapAll(elmWrapperBox);
      elmWrapperBox = elmInputWrapper.find('> div');

      elmInputBox.attr('data-mentions-input', 'true');
      elmInputBox.bind('keydown', onInputBoxKeyDown);
      elmInputBox.bind('keypress', onInputBoxKeyPress);
      elmInputBox.bind('input', onInputBoxInput);
      elmInputBox.bind('change', onInputBoxInput);
      elmInputBox.bind('click', onInputBoxClick);
      elmInputBox.bind('blur', onInputBoxBlur);

      // Elastic textareas, internal setting for the Dispora guys
      if( settings.elastic ) {
        elmInputBox.elastic();
      }

    }

    function initAutocomplete() {
      elmAutocompleteList = $(settings.templates.autocompleteList());
      elmAutocompleteList.appendTo(elmWrapperBox);
      elmAutocompleteList.delegate('li', 'mousedown', onAutoCompleteItemClick);
    }

    function initMentionsOverlay() {
      elmMentionsOverlay = $(settings.templates.mentionsOverlay());
      elmMentionsOverlay.prependTo(elmWrapperBox);
    }

    function updateValues() {
      var remaining = getInputBoxValue();
      var syntaxMessage = "";

      var orderedMentionsCollection = _.sortBy(mentionsCollection, function (a){ return a.approxIndex });

      _.each(orderedMentionsCollection, function (mention) {
        // Merge in default trigger character,  if one not set
        _.defaults(mention, {trigger: settings.defaultTriggerChar});
        var textSyntax = settings.templates.mentionItemSyntax(mention);
        var parts = remaining.split(mention.value);

        syntaxMessage += parts.shift();
        if(parts.length > 0){
          // Always two parts if a match, meaning there should be at least one
          // part left after shift
          syntaxMessage += textSyntax;
        }
        remaining = parts.join(mention.value);
      });

      syntaxMessage += remaining;

      var mentionText = utils.htmlEncode(syntaxMessage);

      _.each(orderedMentionsCollection, function (mention) {
        var formattedMention = _.extend({}, mention, {value: utils.htmlEncode(mention.value)});
        var textSyntax = settings.templates.mentionItemSyntax(formattedMention);
        var textHighlight = settings.templates.mentionItemHighlight(formattedMention);

        mentionText = mentionText.replace(textSyntax, textHighlight);
      });

      mentionText = mentionText.replace(/\n/g, '<br />');
      mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');

      (elmInputBox) ? elmInputBox.data('messageText', syntaxMessage) : 0;
      (elmMentionsOverlay) ? elmMentionsOverlay.find('div').html(mentionText) : 0;
    }

    function resetBuffer() {
      inputBuffer = [];
    }

    function updateMentionsCollection() {
      var inputText = getInputBoxValue();

      mentionsCollection = _.reject(mentionsCollection, function (mention, index) {
        return !mention.value || inputText.indexOf(mention.value) == -1;
      });
      mentionsCollection = _.compact(mentionsCollection);
    }

    function addMention(mention) {
      var currentMessage = getInputBoxValue();
      var currentTriggerChar = mention.trigger ? mention.trigger : settings.defaultTriggerChar;

      // Using a regex to figure out positions
      var regex = new RegExp("\\" + currentTriggerChar + currentDataQuery, "gi");
      var lastIndex = 0;
      var caret = utils.getCaretPosition(elmInputBox[0]);

      while(regex.exec(currentMessage) != null){
        // Move last index unless we've passed the caret.
        if(regex.lastIndex <= caret){
          lastIndex = regex.lastIndex;
        }
      }

      var startCaretPosition = lastIndex - currentDataQuery.length - 1;
      var currentCaretPosition = lastIndex;


      var start = currentMessage.substr(0, startCaretPosition);
      var end = currentMessage.substr(currentCaretPosition, currentMessage.length);
      var startEndIndex = (start + mention.value).length + 1;
      mention.approxIndex = lastIndex;
      _.each(mentionsCollection, function(oldMention){
        if(oldMention.approxIndex >= caret){
          // If the caret is in front of a mention, bump the index of the
          // trailing mentions to approximate their new indexes.
          oldMention.approxIndex = oldMention.approxIndex + mention.value.length;
        }
      });
      mentionsCollection.push(mention);

      // Cleaning before inserting the value, otherwise auto-complete would be triggered with "old" inputbuffer
      resetBuffer();
      currentDataQuery = '';
      hideAutoComplete();

      // Mentions & syntax message
      var updatedMessageText = start + mention.value + ' ' + end;
      elmInputBox.val(updatedMessageText);
      updateValues();
      $(document).trigger('mentionsInput:add');
      // Set correct focus and selection
      elmInputBox.focus();

      // doesn't work on IE8, who cares?
      utils.setCaretPosition(elmInputBox[0], startEndIndex);
    }

    function getInputBoxValue() {
      return (elmInputBox) ? $.trim(elmInputBox.val()) : '';
    }

    function onAutoCompleteItemClick(e) {
      var elmTarget = $(this);
      var mention = autocompleteItemCollection[elmTarget.attr('data-uid')];

      addMention(mention);

      return false;
    }

    function onInputBoxClick(e) {
      resetBuffer();
    }

    function onInputBoxBlur(e) {
      hideAutoComplete();
    }

    function checkTriggerChar(inputBuffer, triggerChar) {
      var triggerCharIndex = _.lastIndexOf(inputBuffer, triggerChar);
      if (triggerCharIndex > -1) {
        currentDataQuery = inputBuffer.slice(triggerCharIndex + 1).join('');
        currentDataQuery = utils.rtrim(currentDataQuery);
        _.defer(_.bind(doSearch, this, currentDataQuery, triggerChar));
      }
    }
    function onInputBoxInput(e) {
      updateValues();
      updateMentionsCollection();
      hideAutoComplete();
      var matchedChar = _.max(settings.triggerChar, function(character){
        return _.lastIndexOf(inputBuffer, character);
      });

      if(matchedChar){
        checkTriggerChar(inputBuffer, matchedChar);
      }
    }

    function onInputBoxKeyPress(e) {
      if(e.keyCode !== KEY.BACKSPACE) {
        var typedValue = String.fromCharCode(e.which || e.keyCode);
        inputBuffer.push(typedValue);
      }
    }

    function onInputBoxKeyDown(e) {

      // This also matches HOME/END on OSX which is CMD+LEFT, CMD+RIGHT
      if (e.keyCode == KEY.LEFT || e.keyCode == KEY.RIGHT || e.keyCode == KEY.HOME || e.keyCode == KEY.END) {
        // Defer execution to ensure carat pos has changed after HOME/END keys
        _.defer(resetBuffer);

        // IE9 doesn't fire the oninput event when backspace or delete is pressed. This causes the highlighting
        // to stay on the screen whenever backspace is pressed after a highlighed word. This is simply a hack
        // to force updateValues() to fire when backspace/delete is pressed in IE9.
        if (navigator.userAgent.indexOf("MSIE 9") > -1) {
          _.defer(updateValues);
        }

        return;
      }

      if (e.keyCode == KEY.BACKSPACE) {
        inputBuffer = inputBuffer.slice(0, -1 + inputBuffer.length); // Can't use splice, not available in IE
        return;
      }

      if (!elmAutocompleteList.is(':visible')) {
        return true;
      }

      switch (e.keyCode) {
        case KEY.UP:
        case KEY.DOWN:
          var elmCurrentAutoCompleteItem = null;
          if (e.keyCode == KEY.DOWN) {
            if (elmActiveAutoCompleteItem && elmActiveAutoCompleteItem.length) {
              elmCurrentAutoCompleteItem = elmActiveAutoCompleteItem.next();
            } else {
              elmCurrentAutoCompleteItem = elmAutocompleteList.find('li').first();
            }
          } else {
            elmCurrentAutoCompleteItem = $(elmActiveAutoCompleteItem).prev();
          }

          if (elmCurrentAutoCompleteItem.length) {
            selectAutoCompleteItem(elmCurrentAutoCompleteItem);
          }

          return false;

        case KEY.RETURN:
        case KEY.TAB:
          if (elmActiveAutoCompleteItem && elmActiveAutoCompleteItem.length) {
            elmActiveAutoCompleteItem.trigger('mousedown');
            return false;
          }

          break;
      }

      return true;
    }

    function hideAutoComplete() {
      elmActiveAutoCompleteItem = null;
      elmAutocompleteList.empty().hide();
    }

    function selectAutoCompleteItem(elmItem) {
      elmItem.addClass(settings.classes.autoCompleteItemActive);
      elmItem.siblings().removeClass(settings.classes.autoCompleteItemActive);

      elmActiveAutoCompleteItem = elmItem;
    }

    function populateDropdown(query, results) {
      elmAutocompleteList.show();

      // Filter items that has already been mentioned
      /*
      var mentionValues = _.pluck(mentionsCollection, 'id');
      var triggerChar = '';
      results = _.reject(results, function (item) {
        return _.include(mentionValues, item.id);
      });
      */

      if (!results.length) {
        hideAutoComplete();
        return;
      }

      elmAutocompleteList.empty();
      var elmDropDownList = $("<ul>").appendTo(elmAutocompleteList).hide();

      _.each(results, function (item, index) {
        var itemUid = _.uniqueId('mention_');

        var triggerChar = item.trigger ? item.trigger : settings.defaultTriggerChar;
        autocompleteItemCollection[itemUid] = _.extend({}, item, {value: triggerChar+item.name});

        var elmListItem = $(settings.templates.autocompleteListItem({
          'id'      : utils.htmlEncode(item.id),
          'display' : utils.htmlEncode(item[settings.display]),
          'type'    : utils.htmlEncode(item.type),
          'content' : item.autocomplete_content ? item.autocomplete_content : utils.htmlEncode(item.name)
        })).attr('data-uid', itemUid);

        if (index === 0) {
          selectAutoCompleteItem(elmListItem);
        }

        if (settings.showAvatars) {
          var elmIcon;

          if (item.avatar) {
            elmIcon = $(settings.templates.autocompleteListItemAvatar({ avatar : item.avatar }));
            elmIcon.prependTo(elmListItem);
          } else if (item.icon) {
            elmIcon = $(settings.templates.autocompleteListItemIcon({ icon : item.icon }));
            elmIcon.prependTo(elmListItem);
          }
        }
        elmListItem = elmListItem.appendTo(elmDropDownList);
      });

      elmAutocompleteList.show();
      if (settings.onCaret) positionAutocomplete(elmAutocompleteList, elmInputBox);
      elmDropDownList.show();
    }

    function doSearch(query, triggerChar) {
      if (query && query.length && query.length >= settings.minChars) {
        settings.onDataRequest.call(this, 'search', query, function (responseData) {
          populateDropdown(query, responseData);
        }, triggerChar);
      }
    }

    function resetInput(currentVal) {
      if(currentVal){
        mentionsCollection = [];
        var mentionText = currentVal;

        // Set the match[3] 'type' to 'user:' so this regex no longer eats
        // every single Markdown link. In case we want to have multiple custom
        // mention types, we need to revert and think of a better solution.
        // var regex = new RegExp("\\[(" + settings.triggerChar.join('|') + "|)(.*?)\\]\\((.*?):(.*?)\\)", "gi");
        var trigger = settings.triggerChar.length === 1 ? settings.triggerChar[0] : settings.triggerChar.join('|');
        var regex = new RegExp("\\[(" + trigger + ")([\x00-\x80.]*?)\\]\\((user):([\x00-\x80.]*?)\\)", "gi");
        var match;
        var newMentionText = mentionText;
        while ((match = regex.exec(mentionText)) != null) {    // Find all matches in a string
            newMentionText = newMentionText.replace(match[0],match[1]+match[2]);
            mentionsCollection.push({   // Btw: match[0] is the complete match
                'id': match[4],
                'type': match[3],
                'value': match[1]+match[2],
                'trigger': match[1]
            });
        }
        // Recalculate approxIndex
        _.each(mentionsCollection, function(mention) {
          mention.approxIndex = newMentionText.indexOf(mention.value);
        });
        elmInputBox.val(newMentionText);
        updateValues();
      }
      else{
        (elmInputBox) ? elmInputBox.val('') : 0;
        mentionsCollection = [];
        updateValues();
      }
    }

    function positionAutocomplete(elmAutocompleteList, elmInputBox) {
      elmAutocompleteList.addClass('onCaret');
      var position = elmInputBox.textareaHelper('caretPos'),
          lineHeight = parseInt(elmInputBox.css('line-height'), 10) || 18;
      elmAutocompleteList.css('width', '12em'); // Sort of a guess
      elmAutocompleteList.css('left', position.left);
      elmAutocompleteList.css('top', lineHeight + position.top);
    }

    // Public methods
    return {
      init : function (domTarget) {

        domInput = domTarget;

        initTextarea();
        initAutocomplete();
        initMentionsOverlay();
        if(settings.useCurrentVal){
          resetInput(getInputBoxValue());
        }
        else{
          resetInput();
        }

        if( settings.prefillMention ) {
          addMention( settings.prefillMention );
        }

      },

      val : function (callback) {
        if (!_.isFunction(callback)) {
          return;
        }
        var value = mentionsCollection.length ? elmInputBox.data('messageText') : getInputBoxValue();
        callback.call(this, value);
      },

      reset : function () {
        resetInput();
      },

      getMentions : function (callback) {
        if (!_.isFunction(callback)) {
          return;
        }

        callback.call(this, mentionsCollection);
      }
    };
  };

  $.fn.mentionsInput = function (method, settings) {

    var outerArguments = arguments;

    if (typeof method === 'object' || !method) {
      settings = method;
    }

    return this.each(function () {
      var instance = $.data(this, 'mentionsInput') || $.data(this, 'mentionsInput', new MentionsInput(settings));

      if (_.isFunction(instance[method])) {
        return instance[method].apply(this, Array.prototype.slice.call(outerArguments, 1));

      } else if (typeof method === 'object' || !method) {
        return instance.init.call(this, this);

      } else {
        $.error('Method ' + method + ' does not exist');
      }

    });
  };

})(jQuery, _);