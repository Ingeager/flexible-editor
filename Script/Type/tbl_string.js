//FLEX_INCLUDE "common_default.js"
//FLEX_ATTR "TBL", "Table File", "FILE", "*.tbl"

function init() {
	DefaultControls.init();
	tblStringObj = new tblString();
	tblStringObj.initDefault();
	tblStringObj.init();
}

tblString = function() {
	this.tblCollectionType = function() {
	this.name = "MAIN";
	this.firstEntry = 0;
	this.lastEntry = 0;
}

  this.nonNormalCfgItem = function(a_regExp, a_tblDetectFunc) {
        this.regExp = new RegExp(a_regExp);
        this.tblDetectFunc = a_tblDetectFunc;
    }

    this.entryType = function() {
        this.byteCount = 0;        // # of bytes of left side value
        this.byteArray = [];        //  left side data
        this.entryType = -1;       //  -1 for Normal, otherwise
                                                       //  handler index of Non-normal.
        this.string = "";                //  Right side characters or Label
        this.extData = [];
     }

    this.getByte = function(a_ptr) {return(Core.getByte(a_ptr));}
    this.setByte = function(a_ptr, a_val) {Core.setByte(a_ptr, a_val);}

    this.tableEntries = [];      //  Contains all table entries
    this.tblCollection = [];
    this.tblName = "";
    this.registeredEntry = false;      //Used to detect 2nd logical table
    this.currentLogicalTable = 0;
    this.eeArr = [];               //  Contains all possible byte sizes from large to small
    this.textCtrl = 0;
    this.logCtrl = 0;
    this.currentEntry = 0;
    this.sizeArr = [];
    this.sizeToTableEntry = [];
    this.bracketBehaviour = 0;
            //0: [string] Square brackets allowed in strings
            //1: [$B0BA] Square brackets identifies raw Hex
    this.bigEndian = false;
    this.nonNormalCfg = [];
    this.cacheLog = false;
    this.logCache = "";
}

tblString.prototype.init = function() {
  this.tblName = "MAIN";
  this.registeredEntry = false;  
  this.currentEntry = 0;  //Entry counter across all tables
  this.sizeArr = [];

  this.textCtrl = new QPlainTextEdit(Core.window);
  this.textCtrl.move(Core.base_x, Core.base_y);
  this.textCtrl.resize(600, 200);
  this.textCtrl.styleSheet = Core.customize("edit.stylesheet", "");
  this.textCtrl.show();

  this.logCtrl = new QPlainTextEdit(Core.window);
  this.logCtrl.move(Core.base_x, Core.base_y+240);
  this.logCtrl.resize(600, 300);
  this.logCtrl.styleSheet = Core.customize("edit.stylesheet", "");
  this.logCtrl.show();

  this.convertBtn = new QPushButton(Core.window);
  this.convertBtn.text = "Convert (Insert)";
  this.convertBtn.move(Core.base_x+15, Core.base_y+208);
  this.convertBtn.resize(120, 25);
  this.convertBtn.pressed.connect(this, this.convertBtnFunc);
  this.convertBtn.show();

  if (Core.versionDate < 250815) {
      // Needs at least Core.loadTextFile.
      this.log("Error: TBL_STRING needs at least b251111 of Flexible Editor to work") ;
      return;
  }
  if (Core.versionDate < 251201) {
      this.log("Warning: UTF-8 tables not supported for b" + Core.versionDate);
      this.log("(Will be supported in newer build.)");
  }
  this.log("Warning: TBL_STRING is still in early development. USE AT OWN RISK!");

  this.loadTable();
  var inString = "";
  inString = this.translateIn();
  this.textCtrl.plainText = inString;
}

tblString.prototype.convertBtnFunc = function() {
	var outString = this.textCtrl.plainText;
	this.translateOut(outString);
}

tblString.prototype.initDefault = function() { 
	this.addHandler("^#", this.tblDetectFunc_comment);
	this.addHandler("^[(].+[)]$", this.tblDetectFunc_bookmark);
}

tblString.prototype.initTranscorp = function() {
	this.addHandler("^@", this, this.tblDetectFunc_newTable);
	this.addHandler("^/", this, this.tblDetectFunc_removeFirstChar);
	this.bracketBehaviour = 1;
}

tblString.prototype.addHandler = function(a_regexp, a_tblDetectFunc) {
	var item = new this.nonNormalCfgItem(a_regexp, a_tblDetectFunc);
	this.nonNormalCfg.push(item);
}

tblString.prototype.log = function(a_str) {
   if (this.cacheLog == false) {
	    this.logCtrl.plainText += a_str + "\n";
   } else {
	this.logCache += a_str + "\n";
   }
}

tblString.prototype.lineError = function(a_lineIx, a_line, a_text) {
	var fullStr = "TBL Parser: Line " + (a_lineIx+1) + ": ''" + a_line + "'': " + a_text;
	this.log(fullStr);
}

tblString.prototype.loadTable = function() {

  var tblFile, tblData, tblDataArr;
  tblFile = Core.getAttr("tbl");

  tblData = Core.loadTextFile(tblFile);
  if (tblData.length == 0) {
	this.log("Failed to load ''" + tblFile + "''");
	return;
  }
  this.loadTableFile(tblData);
  this.log("Loaded table ''" + tblFile + "''");

}

tblString.prototype.tblDetectFunc_comment = function(a_line, a_lineIx) {
    // It's a Comment, just skip line
    return "";
}

tblString.prototype.tblDetectFunc_bookmark = function(a_line, a_lineIx) {
    this.lineError(a_lineIx, a_line, "Bookmarks not handled, skipping line.");
    return "";
}

tblString.prototype.tblDetectFunc_newTable = function(a_line, a_lineIx) {
    //New Logical Table

    /*    var tblName = this.slice(a_line, 1);
        if (this.tblCollection.length > 0) {
             
              var index = this.tblCollection.length;
              this.tblCollection[index].lastEntry = this.currentEntry-1;
        }

        var table = new this.tblCollectionType();   
        table.name = tblName;
        table.firstEntry = this.currentEntry;
        table.lastEntry = this.currentEntry;
        this.tblCollection.append(table);
 
        this.tblName = tblName;

        */
    return "";
}

tblString.prototype.tblDetectFunc_removeFirstChar = function(a_line, a_lineIx) {
    // Chop off the first character and continue
    // (Control code, End token, Table switch)
    return a_line.slice(1);
}

tblString.prototype.tblParseFunc_controlCode = function(a_tableEntry, a_rightSide) {
    var result = this.getLabel(a_rightSide);
    if (result != "") {

    } else {

    }
 }

tblString.prototype.getLabel = function(a_string) {
    var br_l = a_string.firstIndexOf("[");
    var br_r;
    var okay = true;
    if (br_l < 0) {
       okay = false;
     }
     if (okay == true) {
         br_r = a_rightSide.firstIndexOf("]");
         if (br < 0) {
             okay = false;
         }
     }
}

tblString.prototype.dumpFunc_controlCode = function(a_status) {
    a_status.output = "[" + this.tableEntries[a_status.matchIndex].labelName;
    var param = this.tableEntries[a_status.matchIndex].paramCount;
    if (param > 0) {
        for (par_ix = 0; par_ix < param; par_ix++) {
            if (par_ix < a_status.argCacheSize) {
            
            }
        }
    }
    return a_status;
}

tblString.prototype.insFunc_null = function(a_status) {
	return a_status;
}

tblString.prototype.InsLoopFunc_ctrlCode = function(a_status) {
    var pattern = /^[[]{1}/;
    if (pattern.test(a_status.string) == true) {
        if (this.cmdCodeEntries != undefined) {
            for (var ix = 0; ix < this.cmdCodeEntries.length; ix++) {
                var entry = this.cmdCodeEntries[ix];
                var cmdCodeStr = this.tableEntries[entry].string;
                //if () {
                    a_status.insertEntry = entry;
                    //check for parameters (member exist for control codes)
                    var parCount = this.tableEntries[entry].paramCount;
                    if (parCount > 0) {
                        for (var parIx = 0; parIx < parCount; parIx++) {
                            var paramName = this.tableEntries[entry].paramNames[parIx];
                            var pos = a_status.string.firstIndexOf(paramName);
                            if (pos >= 0) {
                                
                            } else {
                                this.log("Parameter not found: ''" + paramName + "'' for Control Code ''[" + cmdCodeStr + "]''");
                            }
                        }
                    }
                //}
            }
        }
    }
    return a_status;
}

tblString.prototype.InsEndFunc_endToken = function(a_status) {
    if (this.endTokenEntry != undefined) {
        a_status.insertEntry = this.endTokenEntry;
    }
    return a_status;
}

tblString.prototype.loadTableFile = function(a_tblData) {

  tblLines = a_tblData.replace(/\r/g, "").split(/\n/);
  
  var lineIx = 0;

  for (lineIx = 0; lineIx < tblLines.length; lineIx++) {

    var line = tblLines[lineIx];
    var hexValue = 0;
    var stringValue = 0;
    var handle = true;

    if (line.length == 0) {handle = false;}
   
  /*  if (handle == true) {
        //Check if line is whitespace only
        if (line.trim.length == 0) {handle = false; print("line is blank");}
    }*/

    var nonNormalIndex = 0;
    var nonNormal = false;

    if (handle == true) {
        var index;
        var found = false;
        for (index = 0; index < this.nonNormalCfg.length; index++) {
            if (this.nonNormalCfg[index].regExp.test(line) == true) {
                found = true;
                break;
            }
        }
        if (found == true) {
            nonNormalIndex = index;
            nonNormal = true;
            line = this.nonNormalCfg[nonNormalIndex].tblDetectFunc.call(this, line, lineIx);
            if (line != "") {
                //If line is not empty, check if it can be parsed as Non-normal
                var nonNormalRegExp = new RegExp("^[a-fA-F0-9]+.*");
                if (nonNormalRegExp.test(line) == false) {
                    this.lineError(lineIx, line, "Error: Line cannot be parsed as a Non-normal, skipping");
                    handle = false;
                }
            } else {
                //if resulting line is empty, handling is finished.
                handle = false;
            }
        } else {
            //Check if line can be parsed as Normal entry

            var normalRegExp = new RegExp("^[a-fA-F0-9]+[=]{1}.*$");
            if (normalRegExp.test(line) == true) {

            } else {
                // Not recognized by any check, report error.

                this.lineError(lineIx, line, "Error: Line not recognized as a Normal entry or by any handlers. Skipping.");
                handle = false;
            }
        }
    }
    
    var eqpos;
    var readlen;
    var leftSide;
     
    if (handle == true) {
         // Find position of equal sign.
         // In case of Normal, we've confirmed it's present.
         // For Non-normal, it may or may not be present

         eqpos = line.indexOf("=");
 
         if (eqpos > 0) {
              readlen = eqpos;
          } else {
              readlen = line.length-1;
          }

          leftSide = line.slice(0, readlen);
//		  this.log("leftside:" + leftSide);

         //prepare new table entry
         var entryIndex = this.tableEntries.length;
         var tableEntry = new this.entryType();

          if (nonNormal == true) {
              tableEntry.type = nonNormalIndex;
          } else {
              tableEntry.type = -1;
          }

              // Obtain hex value on left side
              var byteCount = 0;
              var charCount = 0;
              var charValue = 0;
              var nibbleCount = 0;
              for (charCount = 0; charCount < eqpos; charCount++) {
                  var addChar = false;
                  var charx = leftSide.charAt(eqpos - 1 - charCount);
		  var charcode = 0;
//		  if (charx.length > 0) {
			charcode = charx.charCodeAt(0);
//		}
                  var result  = this.getHexDigit(charcode);
                  if (result >= 0) {
                      if ((nibbleCount & 1) == 0) {
                          tableEntry.byteCount++;
                          tableEntry.byteArray.push(result);
                      } else {
                          tableEntry.byteArray[tableEntry.byteCount-1] |= (result * 16);
                      }
                      nibbleCount++;
                  } else {
                      this.lineError(lineIx, line, "Character '" + charx + "' not Hexadecimal.");
                  }
              }
              if ((nibbleCount & 1) == 1) {
                  this.lineError(lineIx, line, "Warning: Hex sequence doesn't have an even number of characters.");
              }

	//todo: check if there is nothing on right side
          var hasRightSide;
          if (readlen > 0) {
              rightSide = line.slice(readlen+1);
	      			
              hasRightSide = true;
          } else {
              hasRightSide = false;
          }
          
          if (nonNormal == false) {
              //Finish setting up Normal entry
              if (hasRightSide == false) {
                  tableEntry.string = "";
              } else {
                  tableEntry.string = rightSide;
              }

          } else {

              //call F2
          }

          this.tableEntries.push(tableEntry);
          this.registeredEntry = true;

          if (this.sizeArr.indexOf(tableEntry.byteCount) < 0) {
              this.sizeArr.push(tableEntry.byteCount);
              this.sizeArr.sort(function(a,b){return(b-a);});
	  }
	if (this.sizeToTableEntry[tableEntry.byteCount] == undefined) {
		this.sizeToTableEntry[tableEntry.byteCount] = [];
	}
	var stteIndex = this.sizeToTableEntry[tableEntry.byteCount].length;
	this.sizeToTableEntry[tableEntry.byteCount][stteIndex] = entryIndex;

          if (this.tblCollection.length == 0) {
              var tblColItem = new this.tblCollectionType();
              tblColItem.name = this.tblName;
              tblColItem.firstEntry = 0;
              tblColItem.lastEntry = 0;
          }

      } // Handle == true? check
    } // line loop

//	this.log(this.sizeToTableEntry.toString());

    if (this.tblCollection.length > 0) {
        this.tblCollection[this.tblCollection.length-1].lastEntry = this.entryCount-1;
    }

}

tblString.prototype.getHexDigit = function(a_charCode) {
	 if ((a_charCode >= 0x30) && (a_charCode <= 0x39)) {
	      return(a_charCode - 0x30);
	  }
	 if ((a_charCode >= 0x41) && (a_charCode <= 0x46)) {
	      return(a_charCode - 0x41 + 10);
	  }
	 if ((a_charCode >= 0x61) && (a_charCode <= 0x66)) {
	      return(a_charCode - 0x61 + 10);
	}
    return -1;
}

// Convert binary to text (Dumping)
tblString.prototype.translateIn = function() {

    if (this.sizeArr.length == 0) {return;}
    if (this.sizeToTableEntry.length == 0) {return;}

    var outputStr = "";
    var largestByteSize = this.sizeArr[0];

    var pointer = 0;

    var readLen = 64;
    if (Core.hasAttr("len") == true) {
        readLen = Core.getHexValueAttr("len");
    }

    var byteCache = [readLen];

    // Load byte data into cache (speed+)
    var byteCount;
    for (byteCount = 0; byteCount < readLen; byteCount++) {
         byteCache[byteCount] = this.getByte(byteCount);
    }

    var byteCachePos = 0;
    while (byteCachePos < readLen) {

    var match = false;
    var matchIndex = 0;
    var matchTotal = false;
    var byteCount = 0;
    var byteSize = 1;

    // Find binary matches, from largest byte size to smallest.
    for (sizeIndex = 0; sizeIndex < this.sizeArr.length; sizeIndex++) {
        byteSize = this.sizeArr[sizeIndex];
        if ((byteCachePos + byteSize) <= readLen) {
            var entryCount;
            for (entryCount = 0; entryCount < this.sizeToTableEntry[byteSize].length; entryCount++) {
                var entryIndex = this.sizeToTableEntry[byteSize][entryCount];
        
                byteCount = 0;
                match = true;
                while ((byteCount < byteSize) && (match == true)) {
                    match = (byteCache[byteCachePos + byteCount] == this.tableEntries[entryIndex].byteArray[byteCount]);
                    byteCount++;
                }
                if (match == true) {
                     matchIndex = entryCount;
                     matchTotal = true;
                }
            }
        }
        // If match found for this byte size, break out.
        if (matchTotal == true) {break;}
    }

    if (matchTotal == true) {
        outputStr += this.tableEntries[matchIndex].string;
        byteCachePos += byteSize;
    } else {
        var byteVal = byteCache[byteCachePos];
        this.log("Dump: No match found for 0x" + byteVal.toString(16).toUpperCase() + " at byte index " + byteCachePos);
        
        if (this.bracketBehaviour >= 1)  {
            // todo: add raw hex into string
        }

        byteCachePos += 1;
    }
    
    } // byte loop
    return outputStr;
}

tblString.prototype.debugTest = function() {

}

tblString.prototype.setupTestTbl = function() {
 
}

//Convert text to binary (Insertion)
//"Optimal Path" capable (outputs smallest possible result)
tblString.prototype.translateOut = function(a_inputStr) {

    var inputStr = a_inputStr;
    var binaryStrings = [];
    // ^ Collection of resulting binary strings.
    //If there ends up being more than one, the shortest one is used.
    var currentBS = 0;    //Current byte string
    binaryStrings[0] = [];

    var writeStatusObj = function(a_bytePos, a_charPos, a_entryCount) {
        this.charPos = a_charPos;
        this.bytePos = a_bytePos;
        this.entryCount = a_entryCount;   // Backup of current table entry we are comparing with
        this.binaryStringIx = 0;      //Backup of binary string index
        this.valid = true;   //set to false if table entry not found.

        // Info for Non-normal callback
        this.endEvent = false;
    }

    var writeStatus = [];
    // ^ Stack containing backups of write status which is pushed on stack
    // when there is a fork in the possible path to take.
    // The function will finish one possible path, pop from this stack
    // and continue the next alternate path from the point before.

    var curWriteStatus = new writeStatusObj(0, 0, 0);
    //^ active write status

    var smallestBString = -1;
    var smallestBStringSz = 0;
    var smallestBStringValid = true;
    var largestBStringSz = 0;

    var handlePath = true;
    while (handlePath == true) {// while writeStatus[] array remains empty
    while (curWriteStatus.charPos < inputStr.length) {
        // Check string match in all table entries;
//	   this.log("cp:"+curWriteStatus.charPos);
//	   this.log("len:"+inputStr.length);
       var entryCount = curWriteStatus.entryCount;
 //      	   this.log("ecount:"+entryCount);
        var overallMatch = false;
        var alreadyMatch = false;
        var matchIndex = 0;
	var matchStringSz = 0;
	var matchBinSz = 0;
        var match = false;
        for (entryCount = entryCount; entryCount < this.tableEntries.length; entryCount++) {
            var tblStr = this.tableEntries[entryCount].string;
//		this.log("tblStr:"+ tblStr);
            var tblStrLen = tblStr.length;
            if (this.tableEntries[entryCount].entryType >= 0) {
            
            }
            if (tblStrLen > 0) {
                if ((curWriteStatus.charPos + tblStrLen) <= inputStr.length) {
                    var pos = curWriteStatus.charPos;
                    var compareStr = inputStr.slice(pos, pos+tblStrLen);
               //         this.log("comparestr:" + compareStr);
                    if (tblStr == compareStr) {
                        if (alreadyMatch == true) {
				//Check if string is equally long to previous result, and binary string is just as short, or shorter
				if ((tblStrLen == matchStringSz) && (this.tableEntries[entryCount].byteCount <= matchBinSz)) {
	
					if (this.tableEntries[entryCount].byteCount < matchBinSz) {
						//If the byte count is smaller, change to this one.
						matchIndex = entryCount;
						matchStringSz = tblStrLen;
						matchBinSz = this.tableEntries[matchIndex].byteCount;
					}
				} else {
					//Fork.
				    // Backup write status , break compare loop, continue conversion
				  
				    curWriteStatus.entryCount = entryCount;
				    curWriteStatus.binaryStringIx = currentBS;
				    writeStatus.push(curWriteStatus);
				    curWriteStatus.entryCount = 0;
               break;
				}
                            
                        } else {
                      //          this.log("match: " + entryCount);

                            matchIndex = entryCount;
			    matchStringSz = tblStrLen;
			    matchBinSz = this.tableEntries[matchIndex].byteCount;
                            overallMatch = true;
                            alreadyMatch = true;
                        } //alreadyMatch == true?
                    } //match?
                }  //size is ok?
            }  //table string not empty?
        }  // table entry loop

	var advanceChars = 0;
        if (overallMatch == false) {
            var charPos = curWriteStatus.charPos;
            this.log("Table match not found (character '" + inputStr.at(charPos) + "' at index " + charPos);
            curWriteStatus.valid = false;  //Mark as invalid (don't favor current result)
            advanceChars = 1;
        } else {
            var binaryPos = curWriteStatus.bytePos;
            for (var byteIndex = 0; byteIndex < this.tableEntries[matchIndex].byteCount; byteIndex++) {
                binaryStrings[currentBS][binaryPos] = this.tableEntries[matchIndex].byteArray[byteIndex];
                binaryPos++;
            }
            curWriteStatus.bytePos = binaryPos;
            advanceChars = this.tableEntries[matchIndex].string.length;
	    
        }

         curWriteStatus.charPos += advanceChars;

     } // input string loop

     curWriteStatus.endEvent = true;
     //todo:  call callback (End token)

     // keep track of which binary string is most optimal.
     if (smallestBString < 0) {
         smallestBString = 0;
         smallestBStringSz = curWriteStatus.bytePos;
         largestBStringSz = curWriteStatus.bytePos;
         smallestBStringValid = curWriteStatus.valid;
     } else {
         if (curWriteStatus.bytePos < smallestBStringSz) {
             var a = smallestBStringValid;
             var b = curWriteStatus.valid;
             if ((a == false) || ((a == true) && (b == true))) {
                 smallestBStringSz = curWriteStatus.bytePos;
                 smallestBString = currentBS;
                 smallestBStringValid = curWriteStatus.valid;
             }
         }
         if (curWriteStatus.bytePos > largestBStringSz) {
             largestBStringSz = curWriteStatus.bytePos;
         }
     }
    // this.log("smallest:" + smallestBString + " - " + smallestBStringSz);  

     if (writeStatus.length > 0) {
          // go back to earlier state (take alternate route)
          curWriteStatus = writeStatus.pop();
          //copy binary string up to previous byte position
          var oldBS = curWriteStatus.binaryStringIx;
          currentBS++;
          binaryStrings[currentBS] = [];
          for (var byteIndex = 0; byteIndex < curWriteStatus.bytePos; byteIndex++) {
              binaryStrings[currentBS][byteIndex] = binaryStrings[oldBS][byteIndex];
          }
     } else {
         handlePath = false;
     }
    } // handlePath == true? loop

    var numOfBinaryStrings = binaryStrings.length;
    if (numOfBinaryStrings == 0) {
        this.log("Result of insertion was empty. (0 bytes)");
    } else if (numOfBinaryStrings == 1) {
            this.log("Insertion gave 1 possible result (" + smallestBStringSz + " bytes)");
    } else {
  
            this.log("Insertion gave " + numOfBinaryStrings + " possible results.");
            if (smallestBStringSz == longestBStringSz) {
                this.log("The results were all the same size, at " + smallestBStringSz + " bytes.");
            } else {
                this.log("The shortest at " + smallestBStringSz + "bytes, and longest at " + longestBStringSz + " bytes.");
            }
    }

    if (numOfBinaryStrings > 0) {
        var bsIx = smallestBString;
        var writeBytes = binaryStrings[bsIx].length;
        var maxLen = Core.getHexValueAttr("len");
        var remainBytes = 0;
        remainBytes = (maxLen - writeBytes);
        if (writeBytes > maxLen) {
            writeBytes = maxLen;
        }

        var byteIndex = 0;
        for (byteIndex = 0; byteIndex < writeBytes; byteIndex++) {
            this.setByte(byteIndex, binaryStrings[bsIx][byteIndex]);
        }
       if (remainBytes < 0) {
            this.log((-remainBytes) + " bytes exceeded the space limit and was not inserted.");
        } else {
            this.log("String inserted with " + (remainBytes) + " unused bytes.");
       }
    }
     
} // end function
