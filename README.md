# Flexible Editor Readme

Flexible Editor is a project developed with the goal
of making a general data editor for ROMs and other binaries.
A general editor that is not restricted to one game or
one system.

It can open any file as a Binary (though with a certain
size restriction, for now).
To edit the loaded binary, a database is loaded in the form of an XML
document file that describes data locations and data types.
So, the XML files must be written by users themselves.

The project is kind of a "reboot" of an old project/idea of mine
from 2005/2006 named DRDHack.

Check out "XML format.txt" for a guide on writing XML files
that can be loaded with the editor.
Note that documentation was written in a bit of a hurry in
order to get a release out, there may be mistakes,
and it will be improved.

The plan is to regularily update the project source code
and project components on Github.
You may find new or updated scripts for Data Types,
example XML files, as well as documentation on here before
it's shipped in a binary release.

Flexible Editor is developed in C++ using Qt 4.8.0.

