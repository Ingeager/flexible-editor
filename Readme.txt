
Flexible Editor Readme
======================

Release 2026-08-24:
 - XML format additions:
	- Added BITVALUE data type
	- Added CHR_GB (Game Boy CHR) data type
	- Added GB_NT_ADDR (GameBoy TileMap Address) data type
	- Added MAP data type
	- NameTable address types: Added PIXELW and PIXELH attributes.
	- CHR types: Unlimited LEN (page selector if more than 256 tiles).
	- CHR types: Added support for selection between multiple sub-palettes, if palette is provided.
	- CHR types: Data Type for PALETTE Child Element can now be any palette type.
	- HEX: Removed LEN restriction, UI shows a page selector if data is more than 256 bytes.
	- Added COLLAPSE flag that can be set for any Item.
	- Added Array (LEN attribute) support for Coordinate types
	- Added Array (LEN attribute) support for NameTable address types
	- Advanced: Added Fetch support for many of the data types.
	- Advanced: Added Render system, which in short, allows adding child elements that describes data
		that is to be drawn and updated while editing the data of the parent Item element.
 - Added Help menu with "Data Type Overview" and "Full XML Documentation" options.
 - Added a simple Config file load/save with values stored as text.
 - Added "Reload Binary" under File menu.
 - Added "Auto-load this XML and Bin" option under File menu.
 - Added Hex Editor mode (quick way to edit any file as HEX data type)
 - Added "Set Base Offset" feature, found under Edit menu.
 - XML format-Fixes:
	- HEX data type: Fixed bug where it was possible to write past the end of data (or end of row).
	- ICON tag is now entirely case-insensitive.
 	- linewidth and lineheight in GRID customization class can now be "0". (would previously cause crash)
 - Script API-Additions: QScrollBar control, Core.getByteArray, Core.setByteArray, Core.initRender, Core.updateRender,
	- Core.getElementCount, Core.childElementIndexList, Core.parentElementIndex, Core.getElementTag, BitmapView.initialized property.
	- Added 2nd argument (Element Index) for Core.hasAttr and Core.getAttr.
	- Added 2nd argument (Element Index) for Core.childElementIndex.
	- Added documentation for Core.setBigEndianByteSize in Script API.txt.
 - Script API-Fixes:
	- Core.childElementIndex now returns index of child elements of any TAG, not just PALETTE.
	- Data returned by Fetch function limited to Double Float rather than Signed Int32.
 - XML subfolder: Added Tom & Jerry (NES).xml.

(See Update history.txt for full version history)

Introduction
------------
!!! NOTE: This program is still in early development. Please make backups. !!!

Flexible Editor is a project developed with the intention
of creating a general data editor for ROMs, ISOs and other files.
A general editor that is not restricted to one game or
one system, based on using XML documents to describe data
locations, data types and other specifics.
XML files can be written by the users themselves, but the editor also
has some simple features for creating and editing them.

Flexible Editor can open any file as a Binary, including large ones in a "Write Buffer" mode.

When the editor is opened, it will load a demonstration XML and binary file.
You can start creating a new XML from File -> "New XML file.."

Check out "XML format.txt" or "Full XML Documentation" from the Help menu
for a guide on writing XML files.
"Data Types Overview" in the Help menu gives a more quick and simple reference
of all data types and attributes that can be used.
There are also more example files in the XML subfolder.

The plan is to regularily update the project components on Github.
You may find new or updated scripts for Data Types,
example XML files, as well as documentation on there before
it's shipped in a binary release.

I have typically released at least one "script update pack" between each main release.
These will be available here:

https://github.com/Ingeager/flexible-editor/releases

Flexible Editor is developed in C++ using Qt 4.8.0.

The project is based on an old project/idea of mine from 2005/2006 named DRDHack.

XML Subfolder
-------------

These are XML files that comes bundled with the editor
that can be used for file modification, or as examples.

Write Buffer mode / File Size Restrictions
------------------------------------------

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

Setting Base Offset
-------------------
You can change the base offset of binary editing under Edit -> "Set Base Offset",
it's set in Hexadecimal as a positive or negative value.
This is useful if for example the file is a Headerless SNES ROM and the XML expects
one with a header, or vice versa.

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

Hex Editor mode
---------------
Hex Editor mode is found under File menu. This will simulate a hex editor, creating an environment
based on the HEX data type. (It will set up a simple XML based on the file size).
XML can't be saved or reloaded in this mode.
If you open or reload the binary, the XML will be updated to reflect changes in file size.
To exit Hex Editor mode, restart the program, or use "Open XML file" or "New XML file" from the File menu.

Future Ideas/Plans
------------------
 - "Group" XML feature making it possible to edit multiple Item entries in the same window.
 - Opening files for editing in a "single data type mode".
 - Text editing using Table (.tbl) files ("tbl_string" type) (in progress)
 - Support for formulas or scripts in XML attributes.
 - Retaining character encoding and BOM when saving XML files.
 - XML Import from text documents, other.
 - Data search
 - Configuration window.

Links/Contact
-------------

GitHub: https://github.com/Ingeager/flexible-editor
Contact: ingegjoestoel@hotmail.com

(If anyone wants to contribute any files to the project (XML files, Scripts. etc.),
that is very welcome.)