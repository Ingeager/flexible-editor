
Flexible Editor Readme
======================

Release 2026-02-05:
 - XML format additions:
	- Added data types CHR_NES and CHR_SNES (tiles can be edited).
	- Added PALETTE Element, that can be placed as child elements of CHR data types.
	- Added BIGENDIAN flag for Integers.
  	(Support for Sega Mega Drive, Wii, etc. multi-byte values)
	- Added data type STRING_UTF8.
	- Palette types now has a page selector and can be larger than 256 entries.
	- Added data types PAL_15A, PAL24_BGR, PAL_32, PAL_32ABGR, PAL32_ARGB, and PAL32_BGRA.
	- Added "BGR" flag for all palette types.
	- Added LAB attribute for all Items.
	- Added SNAPX, SNAPY, GRIDX and GRIDY attributes for COORDINATE data type.
 - Added a simple theme selector, with a simple alternate theme.
 - Added Write Buffer mode, which allows using the editor with files of any size. (larger than 1GB)
   when the user opens those. Also added "Open in W-Buffer mode.." from File menu.
 - Added option to undo latest XML edit if it results in a parsing error.
 - Bugfix: Prevented program from hanging (infinite loop) if parsing errors are encountered.
 - XML files are loaded as UTF-8 if valid and saved as UTF-8. (bugfix in part)
 - Bugfix: Fixed UI control placement when main window gets larger than a certain size
 - Bugfix: Fixed Child Items from getting inserted in off places when the Parent Item has text and no children.
 - Bugfix: XML Reader: Fixed support for both uppercase and lowercase in various cases including:
	- List Item and Common "key" attribute can be upppercase.
	- ICON Elements can also be both cases.
 - Bugfix: Title bar updates to show correct file name when opening in Write Buffer mode.
 - Data type UI:
	- Rewrote HEX data type script (greatly improved).
	- Bugfix: Integers: Bit editing controls and List control now reflect each other's changes.
	- Added "Active Pointer" to default controls (common_default.js)
	- Fix: "pal_smd" shows the "Value:" bytes in correct order.
	- Various improvements and bugfixes.
 - XML editing: When removing an Item, if it's the last child of another,
	the XML is now cleaned up so the parent element becomes self-closing.
 - Script API: Changed Core.loadTextFile to load files as UTF-8 if possible.
 - Script API additions: QTimer control, Core.setBigEndianByteSize, Core.getByteAbs, Core.setByteAbs,
   Core.getBinarySize, Core.getActivePtr, Core.stringDecode, Core.stringEncode,
   Core.fetchElementData, Core.childElementIndex, Core.customize,
   BitmapView.drawBuffer, and BitmapView.mouseMove signal.
 - XML subfolder: Added Mega Man 5 (NES).xml, NES Palette File.xml, PSX TIM.xml.

(See Update history.txt for full version history)

Introduction
------------
!!! NOTE: This program is still in early development. Please make backups! !!!

Flexible Editor is a project developed with the intention
of creating a general data editor for ROMs, ISOs and other files.
A general editor that is not restricted to one game or
one system.

The project is kind of a "reboot" of an old project/idea of mine
from 2005/2006 named DRDHack.

Flexible Editor can open any file as a Binary, including large ones in a "Write Buffer" mode.
To edit the loaded binary, a database is loaded or created in the form of an XML
document file that describes data locations, data types and other specifics.
XML files can be written by the users themselves, but the editor also
has some simple features now for creating and editing them.

When the editor is opened, it will load a demonstration XML and binary file.
You can start creating a new XML from File -> "New XML file.."

Check out "XML format.txt" for a guide on writing XML files.
Also, there are more example files in the XML subfolders.

The plan is to regularily update the project source code
and project components on Github.
You may find new or updated scripts for Data Types,
example XML files, as well as documentation on there before
it's shipped in a binary release.

I have typically released at least one "script update pack" between each main release.
These will be available here:

https://github.com/Ingeager/flexible-editor/releases

Flexible Editor is developed in C++ using Qt 4.8.0.

XML Subfolder
-------------

These are XML files that comes bundled with the editor
that can be used for file modification, or as examples.

Write Buffer mode / File Size Restrictions
------------------------------------

Normal loading, editing and saving works for files up to somewhere between 1 and 2 GB.
(Only that it takes some time to load and save such large files and the editor may hang).
When files larger than 300 MB are opened the editor will ask if you want to open
them in Write Buffer mode. In this mode the whole file is not kept in memory,
instead smaller segments of the binary are kept for locations where changes have been made.
Larger files are supported in this mode, probably with virtually no limit.
Note however that the file is constantly open, or "locked" while it's opened
so it can't be changed by other programs. Also, if the files are Write Protected, they won't open.

You can also open any file in Write Buffer mode through "File->Open in W-Buffer mode.."
from the file menu. This is useful if for example you have a file around 200 MB but don't want lag on loading/saving and you don't want the RAM usage. The only downside is that data loads a little
more slowly and the storage medium is accessed more often.

Editing
-------

From the File menu you have multiple actions available for Binary file management
and XML file management.
(You can start creating a new XML from File -> "New XML file..")

From the Edit menu you have actions that allows editing the XML tree, adding
and removing Items.
"Insert Blank Item" will add a new item below the currently selected one in
the tree view.
If none is selected or there are no Items in the tree, it will add one at the top.

"Insert Child Item" will add a child Item to the current Item, at the bottom.
If the current Item doesn't already have any child items it will turn it into a
parent one. (it will not lose any attribute information).

"Delete Item" will delete the currently selected Item and any child Items also.

There's a text box in the lower right part of the screen.
This will allow you to directly modify the XML related to an opened Item.
Just hit the "Update" button once you're done.
You'll have to reopen the window for that Item though.
If something goes wrong or the editor gives a parsing error,
you'll get the option to undo the last change.
You can also always Reload the XML file from the File menu, this will undo
any changes since the last save.

Editing will be disabled if there was a parsing issue at the relevant section
of the XML or earlier.

Unicode support
---------------
XML files and other text documents are loaded as UTF-8 encoded files unless invalid
UTF-8 characters are encountered, then they are loaded as 8-bit Windows-1252 (ANSI).
This is now the case for XML documents, Scripts, and files loaded with Core.loadTextFile within scripts.
Most documents will load fine as UTF-8, but if they happen to have any characters in the
128-255 character code range (for example: "é") and they don't form valid UTF-8 sequences,
the entire document will be loaded as Windows-1252.
UTF-8 encoded files can have a Byte Order Mark.

Please note that when XML files are saved, they will ALWAYS be saved as UTF-8 without a BOM.

Future Ideas/Plans
------------------
 - Opening files for editing in a "single data type mode".
 - Text editing using Table (.tbl) files ("tbl_string" type) (in progress)
 - "Base offset" setting
 - Support for formulas or scripts in XML attributes.
 - Retaining character encoding and BOM when saving XML files.
 - XML Import from text documents, other.
 - Data search
 - Configuration window / config file.
 - Elements for rendering graphics in an editing window
   based on other data types / data from the binary.

Links/Contact
-------------

GitHub: https://github.com/Ingeager/flexible-editor
Contact: ingegjoestoel@hotmail.com

(If anyone wants to contribute any files to the project (XML files, Scripts. etc.),
that is very welcome.)