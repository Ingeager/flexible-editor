
Flexible Editor Readme
======================

Release 2025-11-11:
 - Added more file management actions under File menu.
 - Added XML editing actions under Edit menu.
 - XML database Items can be directly edited in the text box at the bottom.
 - Files 1GB and above can be opened in a "Read Only" mode.
   (Has been tested to work on a 2GB file)
 - Bugfix: Parent Items no longer displays text belonging to Child Items
 - Script API additions: Core.setArrayIndex, Core.getArrayIndex,
   Core.setArrayByteSize, Core.loadTextFile
 - XML subfolder: Added XML for Magic Sword (SNES)

See XML format.txt for a list of new XML features, including support for
  Icons and Arrays.

Introduction
------------
!!! NOTE: This program is still in early development. Please make backups! !!!

Flexible Editor is a project developed with the itention
of creating a general data editor for ROMs, ISOs and other binaries.
A general editor that is not restricted to one game or
one system.

The project is kind of a "reboot" of an old project/idea of mine
from 2005/2006 named DRDHack.

Flexible Editor can open any file as a Binary, though with a certain
file size restriction for now.
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

Flexible Editor is developed in C++ using Qt 4.8.0.

XML Subfolder
-------------

These are XML files that comes bundled with the editor
that can be used for file modification, or as examples.

File Size Restrictions / Read Only mode
---------------------------------------

Loading, editing and saving works for files up to somewhere between 1 and 2 GB.
(Note that it takes some time to load and save such large files and the editor may hang).
When files larger than 1 GB are opened they can be opened in a Read Only mode
where data is read directly from the file and the file is not kept in memory.
In the future, I will try to make it possible to edit large files.

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
you can Reload the XML from the File menu, this will undo any changes since
the last save.

Future Ideas/Plans
------------------
 - Large file editing support using read/write buffers
 - Text editing using Table (.tbl) files (tbl_string type)
 - XML Import from text documents, other
 - Data search

Links/Contact
-------------

GitHub: https://github.com/Ingeager/flexible-editor
Contact: ingegjoestoel@hotmail.com