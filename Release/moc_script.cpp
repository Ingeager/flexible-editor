/****************************************************************************
** Meta object code from reading C++ file 'script.h'
**
** Created: Sat 31. Jan 15:05:00 2026
**      by: The Qt Meta Object Compiler version 63 (Qt 4.8.0)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../script.h"
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'script.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 63
#error "This file was generated using the moc from 4.8.0. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
static const uint qt_meta_data_QLabelSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      14,   10,    9,    9, 0x02,
      36,   28,    9,    9, 0x02,
      69,   65,    9,    9, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QLabelSC[] = {
    "QLabelSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0"
};

void QLabelSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QLabelSC *_t = static_cast<QLabelSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QLabelSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QLabelSC::staticMetaObject = {
    { &QLabel::staticMetaObject, qt_meta_stringdata_QLabelSC,
      qt_meta_data_QLabelSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QLabelSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QLabelSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QLabelSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QLabelSC))
        return static_cast<void*>(const_cast< QLabelSC*>(this));
    return QLabel::qt_metacast(_clname);
}

int QLabelSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QLabel::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    }
    return _id;
}
static const uint qt_meta_data_QLineEditSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       4,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      17,   13,   12,   12, 0x02,
      39,   31,   12,   12, 0x02,
      72,   68,   12,   12, 0x02,
      93,   88,   12,   12, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QLineEditSC[] = {
    "QLineEditSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0flag\0setAlignment(int)\0"
};

void QLineEditSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QLineEditSC *_t = static_cast<QLineEditSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 3: _t->setAlignment((*reinterpret_cast< int(*)>(_a[1]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QLineEditSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QLineEditSC::staticMetaObject = {
    { &QLineEdit::staticMetaObject, qt_meta_stringdata_QLineEditSC,
      qt_meta_data_QLineEditSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QLineEditSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QLineEditSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QLineEditSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QLineEditSC))
        return static_cast<void*>(const_cast< QLineEditSC*>(this));
    return QLineEdit::qt_metacast(_clname);
}

int QLineEditSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QLineEdit::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 4)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 4;
    }
    return _id;
}
static const uint qt_meta_data_QPlainTextEditSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      22,   18,   17,   17, 0x02,
      44,   36,   17,   17, 0x02,
      77,   73,   17,   17, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QPlainTextEditSC[] = {
    "QPlainTextEditSC\0\0x,y\0move(int,int)\0"
    "x,y,w,h\0setGeometry(int,int,int,int)\0"
    "w,h\0resize(int,int)\0"
};

void QPlainTextEditSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QPlainTextEditSC *_t = static_cast<QPlainTextEditSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QPlainTextEditSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QPlainTextEditSC::staticMetaObject = {
    { &QPlainTextEdit::staticMetaObject, qt_meta_stringdata_QPlainTextEditSC,
      qt_meta_data_QPlainTextEditSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QPlainTextEditSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QPlainTextEditSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QPlainTextEditSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QPlainTextEditSC))
        return static_cast<void*>(const_cast< QPlainTextEditSC*>(this));
    return QPlainTextEdit::qt_metacast(_clname);
}

int QPlainTextEditSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QPlainTextEdit::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    }
    return _id;
}
static const uint qt_meta_data_QComboBoxSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       8,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      17,   13,   12,   12, 0x02,
      39,   31,   12,   12, 0x02,
      72,   68,   12,   12, 0x02,
      93,   88,   12,   12, 0x02,
     127,  110,   12,   12, 0x02,
     169,  157,   12,   12, 0x22,
     207,  195,   12,   12, 0x02,
     231,  195,   12,   12, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QComboBoxSC[] = {
    "QComboBoxSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0text\0addItem(QString)\0"
    "index,value,role\0setItemData(int,QVariant,int)\0"
    "index,value\0setItemData(int,QVariant)\0"
    "index,color\0setItemBGColor(int,int)\0"
    "setItemFGColor(int,int)\0"
};

void QComboBoxSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QComboBoxSC *_t = static_cast<QComboBoxSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 3: _t->addItem((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 4: _t->setItemData((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< const QVariant(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 5: _t->setItemData((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< const QVariant(*)>(_a[2]))); break;
        case 6: _t->setItemBGColor((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 7: _t->setItemFGColor((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QComboBoxSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QComboBoxSC::staticMetaObject = {
    { &QComboBox::staticMetaObject, qt_meta_stringdata_QComboBoxSC,
      qt_meta_data_QComboBoxSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QComboBoxSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QComboBoxSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QComboBoxSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QComboBoxSC))
        return static_cast<void*>(const_cast< QComboBoxSC*>(this));
    return QComboBox::qt_metacast(_clname);
}

int QComboBoxSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QComboBox::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 8)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 8;
    }
    return _id;
}
static const uint qt_meta_data_QPushButtonSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      19,   15,   14,   14, 0x02,
      41,   33,   14,   14, 0x02,
      74,   70,   14,   14, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QPushButtonSC[] = {
    "QPushButtonSC\0\0x,y\0move(int,int)\0"
    "x,y,w,h\0setGeometry(int,int,int,int)\0"
    "w,h\0resize(int,int)\0"
};

void QPushButtonSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QPushButtonSC *_t = static_cast<QPushButtonSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QPushButtonSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QPushButtonSC::staticMetaObject = {
    { &QPushButton::staticMetaObject, qt_meta_stringdata_QPushButtonSC,
      qt_meta_data_QPushButtonSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QPushButtonSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QPushButtonSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QPushButtonSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QPushButtonSC))
        return static_cast<void*>(const_cast< QPushButtonSC*>(this));
    return QPushButton::qt_metacast(_clname);
}

int QPushButtonSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QPushButton::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    }
    return _id;
}
static const uint qt_meta_data_QFrameSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       4,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      14,   10,    9,    9, 0x02,
      36,   28,    9,    9, 0x02,
      69,   65,    9,    9, 0x02,
      91,   85,    9,    9, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QFrameSC[] = {
    "QFrameSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0style\0setFrameStyle(int)\0"
};

void QFrameSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QFrameSC *_t = static_cast<QFrameSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 3: _t->setFrameStyle((*reinterpret_cast< int(*)>(_a[1]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QFrameSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QFrameSC::staticMetaObject = {
    { &QFrame::staticMetaObject, qt_meta_stringdata_QFrameSC,
      qt_meta_data_QFrameSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QFrameSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QFrameSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QFrameSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QFrameSC))
        return static_cast<void*>(const_cast< QFrameSC*>(this));
    return QFrame::qt_metacast(_clname);
}

int QFrameSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QFrame::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 4)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 4;
    }
    return _id;
}
static const uint qt_meta_data_QSliderSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       8,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      15,   11,   10,   10, 0x02,
      37,   29,   10,   10, 0x02,
      70,   66,   10,   10, 0x02,
      94,   86,   10,   10, 0x02,
     118,  112,   10,   10, 0x02,
     137,  112,   10,   10, 0x02,
     166,  154,   10,   10, 0x02,
     186,  112,   10,   10, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QSliderSC[] = {
    "QSliderSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0min,max\0setRange(int,int)\0"
    "value\0setSingleStep(int)\0setPageStep(int)\0"
    "orientation\0setOrientation(int)\0"
    "setValue(int)\0"
};

void QSliderSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QSliderSC *_t = static_cast<QSliderSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 3: _t->setRange((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 4: _t->setSingleStep((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 5: _t->setPageStep((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 6: _t->setOrientation((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 7: _t->setValue((*reinterpret_cast< int(*)>(_a[1]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QSliderSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QSliderSC::staticMetaObject = {
    { &QSlider::staticMetaObject, qt_meta_stringdata_QSliderSC,
      qt_meta_data_QSliderSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QSliderSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QSliderSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QSliderSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QSliderSC))
        return static_cast<void*>(const_cast< QSliderSC*>(this));
    return QSlider::qt_metacast(_clname);
}

int QSliderSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QSlider::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 8)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 8;
    }
    return _id;
}
static const uint qt_meta_data_QCheckBoxSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      17,   13,   12,   12, 0x02,
      39,   31,   12,   12, 0x02,
      72,   68,   12,   12, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QCheckBoxSC[] = {
    "QCheckBoxSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0"
};

void QCheckBoxSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QCheckBoxSC *_t = static_cast<QCheckBoxSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QCheckBoxSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QCheckBoxSC::staticMetaObject = {
    { &QCheckBox::staticMetaObject, qt_meta_stringdata_QCheckBoxSC,
      qt_meta_data_QCheckBoxSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QCheckBoxSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QCheckBoxSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QCheckBoxSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QCheckBoxSC))
        return static_cast<void*>(const_cast< QCheckBoxSC*>(this));
    return QCheckBox::qt_metacast(_clname);
}

int QCheckBoxSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QCheckBox::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    }
    return _id;
}
static const uint qt_meta_data_QSpinBoxSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // methods: signature, parameters, type, tag, flags
      16,   12,   11,   11, 0x02,
      38,   30,   11,   11, 0x02,
      71,   67,   11,   11, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_QSpinBoxSC[] = {
    "QSpinBoxSC\0\0x,y\0move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0"
};

void QSpinBoxSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        QSpinBoxSC *_t = static_cast<QSpinBoxSC *>(_o);
        switch (_id) {
        case 0: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 2: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData QSpinBoxSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QSpinBoxSC::staticMetaObject = {
    { &QSpinBox::staticMetaObject, qt_meta_stringdata_QSpinBoxSC,
      qt_meta_data_QSpinBoxSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QSpinBoxSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QSpinBoxSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QSpinBoxSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QSpinBoxSC))
        return static_cast<void*>(const_cast< QSpinBoxSC*>(this));
    return QSpinBox::qt_metacast(_clname);
}

int QSpinBoxSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QSpinBox::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    }
    return _id;
}
static const uint qt_meta_data_QTimerSC[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       0,    0, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

       0        // eod
};

static const char qt_meta_stringdata_QTimerSC[] = {
    "QTimerSC\0"
};

void QTimerSC::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    Q_UNUSED(_o);
    Q_UNUSED(_id);
    Q_UNUSED(_c);
    Q_UNUSED(_a);
}

const QMetaObjectExtraData QTimerSC::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject QTimerSC::staticMetaObject = {
    { &QTimer::staticMetaObject, qt_meta_stringdata_QTimerSC,
      qt_meta_data_QTimerSC, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &QTimerSC::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *QTimerSC::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *QTimerSC::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_QTimerSC))
        return static_cast<void*>(const_cast< QTimerSC*>(this));
    return QTimer::qt_metacast(_clname);
}

int QTimerSC::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QTimer::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    return _id;
}
static const uint qt_meta_data_BitmapView[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
      12,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       2,       // signalCount

 // signals: signature, parameters, type, tag, flags
      27,   12,   11,   11, 0x05,
      51,   12,   11,   11, 0x05,

 // methods: signature, parameters, type, tag, flags
      89,   74,   11,   11, 0x02,
     107,  103,   11,   11, 0x02,
     129,  121,   11,   11, 0x02,
     162,  158,   11,   11, 0x02,
     191,  178,   11,   11, 0x02,
     231,  213,   11,   11, 0x02,
     276,  258,   11,   11, 0x02,
     326,  303,   11,   11, 0x02,
     379,  355,   11,   11, 0x02,
     420,   11,   11,   11, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_BitmapView[] = {
    "BitmapView\0\0aButtons,aY,aX\0"
    "mousePress(int,int,int)\0mouseMove(int,int,int)\0"
    "aWidth,aHeight\0init(int,int)\0x,y\0"
    "move(int,int)\0x,y,w,h\0"
    "setGeometry(int,int,int,int)\0w,h\0"
    "resize(int,int)\0aY,aX,aValue\0"
    "setPixel(int,int,int)\0aY,aX1,aX2,aValue\0"
    "drawLineX(int,int,int,int)\0aY1,aY2,aX,aValue\0"
    "drawLineY(int,int,int,int)\0"
    "aY1,aY2,aX1,aX2,aValue\0"
    "drawBox(int,int,int,int,int)\0"
    "aY1,aY2,aX1,aX2,aBuffer\0"
    "drawBuffer(int,int,int,int,QVariantList)\0"
    "refresh()\0"
};

void BitmapView::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        BitmapView *_t = static_cast<BitmapView *>(_o);
        switch (_id) {
        case 0: _t->mousePress((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 1: _t->mouseMove((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 2: _t->init((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 3: _t->move((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 4: _t->setGeometry((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 5: _t->resize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 6: _t->setPixel((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 7: _t->drawLineX((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 8: _t->drawLineY((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 9: _t->drawBox((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4])),(*reinterpret_cast< int(*)>(_a[5]))); break;
        case 10: _t->drawBuffer((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4])),(*reinterpret_cast< QVariantList(*)>(_a[5]))); break;
        case 11: _t->refresh(); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData BitmapView::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject BitmapView::staticMetaObject = {
    { &QGraphicsView::staticMetaObject, qt_meta_stringdata_BitmapView,
      qt_meta_data_BitmapView, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &BitmapView::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *BitmapView::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *BitmapView::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_BitmapView))
        return static_cast<void*>(const_cast< BitmapView*>(this));
    return QGraphicsView::qt_metacast(_clname);
}

int BitmapView::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QGraphicsView::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 12)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 12;
    }
    return _id;
}

// SIGNAL 0
void BitmapView::mousePress(int _t1, int _t2, int _t3)
{
    void *_a[] = { 0, const_cast<void*>(reinterpret_cast<const void*>(&_t1)), const_cast<void*>(reinterpret_cast<const void*>(&_t2)), const_cast<void*>(reinterpret_cast<const void*>(&_t3)) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void BitmapView::mouseMove(int _t1, int _t2, int _t3)
{
    void *_a[] = { 0, const_cast<void*>(reinterpret_cast<const void*>(&_t1)), const_cast<void*>(reinterpret_cast<const void*>(&_t2)), const_cast<void*>(reinterpret_cast<const void*>(&_t3)) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}
static const uint qt_meta_data_tEventForScript[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       2,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: signature, parameters, type, tag, flags
      28,   17,   16,   16, 0x05,

 // methods: signature, parameters, type, tag, flags
      40,   17,   16,   16, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_tEventForScript[] = {
    "tEventForScript\0\0aEventCode\0signal(int)\0"
    "dispatch(int)\0"
};

void tEventForScript::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        tEventForScript *_t = static_cast<tEventForScript *>(_o);
        switch (_id) {
        case 0: _t->signal((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 1: _t->dispatch((*reinterpret_cast< int(*)>(_a[1]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData tEventForScript::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject tEventForScript::staticMetaObject = {
    { &QObject::staticMetaObject, qt_meta_stringdata_tEventForScript,
      qt_meta_data_tEventForScript, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &tEventForScript::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *tEventForScript::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *tEventForScript::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_tEventForScript))
        return static_cast<void*>(const_cast< tEventForScript*>(this));
    return QObject::qt_metacast(_clname);
}

int tEventForScript::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 2)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 2;
    }
    return _id;
}

// SIGNAL 0
void tEventForScript::signal(int _t1)
{
    void *_a[] = { 0, const_cast<void*>(reinterpret_cast<const void*>(&_t1)) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
QT_END_MOC_NAMESPACE
