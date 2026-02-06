/****************************************************************************
** Meta object code from reading C++ file 'mainwindow.h'
**
** Created: Fri 6. Feb 00:05:19 2026
**      by: The Qt Meta Object Compiler version 63 (Qt 4.8.0)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../mainwindow.h"
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'mainwindow.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 63
#error "This file was generated using the moc from 4.8.0. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
static const uint qt_meta_data_MainWindow[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
      19,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: signature, parameters, type, tag, flags
      29,   12,   11,   11, 0x08,
     104,   92,   11,   11, 0x08,
     147,   11,   11,   11, 0x08,
     176,   11,   11,   11, 0x08,
     208,   11,   11,   11, 0x08,
     240,   11,   11,   11, 0x08,
     271,  266,   11,   11, 0x08,
     317,   11,   11,   11, 0x08,
     338,   11,   11,   11, 0x08,
     367,   11,   11,   11, 0x08,
     399,   11,   11,   11, 0x08,
     431,   11,   11,   11, 0x08,
     462,   11,   11,   11, 0x08,
     492,   11,   11,   11, 0x08,
     525,   11,   11,   11, 0x08,
     553,   11,   11,   11, 0x08,
     589,   11,   11,   11, 0x08,
     627,   11,   11,   11, 0x08,
     663,   11,   11,   11, 0x08,

       0        // eod
};

static const char qt_meta_stringdata_MainWindow[] = {
    "MainWindow\0\0current,previous\0"
    "on_wTree_currentItemChanged(QTreeWidgetItem*,QTreeWidgetItem*)\0"
    "item,column\0on_wTree_itemClicked(QTreeWidgetItem*,int)\0"
    "on_actionOpenXML_triggered()\0"
    "on_actionOpenBinary_triggered()\0"
    "on_actionSaveBinary_triggered()\0"
    "on_actionExit_triggered()\0arg1\0"
    "on_mdiArea_subWindowActivated(QMdiSubWindow*)\0"
    "on_wUpdate_clicked()\0on_actionSaveXML_triggered()\0"
    "on_actionInsertItem_triggered()\0"
    "on_actionDeleteItem_triggered()\0"
    "on_actionReloadXML_triggered()\0"
    "on_actionClearXML_triggered()\0"
    "on_actionInsertChild_triggered()\0"
    "on_actionNewXML_triggered()\0"
    "on_actionOpenBinBufMode_triggered()\0"
    "on_actionViewWBufferStats_triggered()\0"
    "on_actionThemeIceDragon_triggered()\0"
    "on_actionThemeNormal_triggered()\0"
};

void MainWindow::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        MainWindow *_t = static_cast<MainWindow *>(_o);
        switch (_id) {
        case 0: _t->on_wTree_currentItemChanged((*reinterpret_cast< QTreeWidgetItem*(*)>(_a[1])),(*reinterpret_cast< QTreeWidgetItem*(*)>(_a[2]))); break;
        case 1: _t->on_wTree_itemClicked((*reinterpret_cast< QTreeWidgetItem*(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 2: _t->on_actionOpenXML_triggered(); break;
        case 3: _t->on_actionOpenBinary_triggered(); break;
        case 4: _t->on_actionSaveBinary_triggered(); break;
        case 5: _t->on_actionExit_triggered(); break;
        case 6: _t->on_mdiArea_subWindowActivated((*reinterpret_cast< QMdiSubWindow*(*)>(_a[1]))); break;
        case 7: _t->on_wUpdate_clicked(); break;
        case 8: _t->on_actionSaveXML_triggered(); break;
        case 9: _t->on_actionInsertItem_triggered(); break;
        case 10: _t->on_actionDeleteItem_triggered(); break;
        case 11: _t->on_actionReloadXML_triggered(); break;
        case 12: _t->on_actionClearXML_triggered(); break;
        case 13: _t->on_actionInsertChild_triggered(); break;
        case 14: _t->on_actionNewXML_triggered(); break;
        case 15: _t->on_actionOpenBinBufMode_triggered(); break;
        case 16: _t->on_actionViewWBufferStats_triggered(); break;
        case 17: _t->on_actionThemeIceDragon_triggered(); break;
        case 18: _t->on_actionThemeNormal_triggered(); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData MainWindow::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject MainWindow::staticMetaObject = {
    { &QMainWindow::staticMetaObject, qt_meta_stringdata_MainWindow,
      qt_meta_data_MainWindow, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &MainWindow::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *MainWindow::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *MainWindow::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_MainWindow))
        return static_cast<void*>(const_cast< MainWindow*>(this));
    return QMainWindow::qt_metacast(_clname);
}

int MainWindow::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QMainWindow::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 19)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 19;
    }
    return _id;
}
QT_END_MOC_NAMESPACE
