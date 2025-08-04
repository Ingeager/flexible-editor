#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QTreeWidget>
#include <QDomNode>
#include <QScriptEngine>

#include <QLineEdit>
#include <QLabel>
#include <QComboBox>
#include <QPushButton>
#include <QFrame>
#include <QGraphicsView>
#include <QGraphicsScene>
#include <QByteArray>
#include <QCheckBox>
#include <QSpinBox>
//#include <QBitmap>
//#include <QPixmap>
//#include <QImage>

#include "itemview.h"

namespace Ui {
class MainWindow;
}

enum { eElmRefRole = Qt::UserRole, eWindowRole} ;


class BitmapView : public QGraphicsView {
    Q_OBJECT

public:
    BitmapView(QWidget *parent) : QGraphicsView(parent) {}
    //~BitmapView();

    QPixmap mPixmap;
    QImage mImage;
    QGraphicsScene mScene;
    
    void mousePressEvent(QMouseEvent *event);

    Q_INVOKABLE void init(int aWidth, int aHeight);
    
    //Note: This is repeated for every class.. I can't find a way to compress it.
    //Things like Q_INVOKABLE and "public slot" is handled by moc, but moc does not expand macros.
    //#include does not work either.
    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
    
    
   // Q_INVOKABLE int height() {return QWidget::height();}
   
    Q_INVOKABLE void setPixel(int aY, int aX, int aValue);
    Q_INVOKABLE void drawLineX(int aY, int aX1, int aX2, int aValue);
    Q_INVOKABLE void drawLineY(int aY1, int aY2, int aX, int aValue);
    Q_INVOKABLE void drawBox(int aY1, int aY2, int aX1, int aX2, int aValue);
    
    Q_INVOKABLE void refresh();

signals:
    void mousePress(int aButtons, int aY, int aX);
};

Q_SCRIPT_DECLARE_QMETAOBJECT(BitmapView, QWidget*)

class QLabelSC : public QLabel {
    Q_OBJECT
public:
    QLabelSC(QWidget *parent, Qt::WindowFlags f = 0) : QLabel(parent, f) {}
    QLabelSC(const QString & text, QWidget * parent = 0, Qt::WindowFlags f = 0 ) :
        QLabel(text, parent, f) {}

    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QLabelSC, QWidget*)


class QLineEditSC : public QLineEdit {
    Q_OBJECT
public:
    QLineEditSC(QWidget *parent) : QLineEdit(parent) {}
    QLineEditSC(const QString & contents, QWidget * parent = 0) :
        QLineEdit(contents, parent) {}

    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}

    Q_INVOKABLE void setAlignment(int flag) {QLineEdit::setAlignment((Qt::Alignment)flag);} 
  
   // Q_INVOKABLE void setReadOnly ( bool a ) {QLineEdit::setReadOnly(a);}

};

Q_SCRIPT_DECLARE_QMETAOBJECT(QLineEditSC, QWidget*)

class QComboBoxSC : public QComboBox {
    Q_OBJECT
public:
    QComboBoxSC(QWidget *parent) : QComboBox(parent) {}

    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}

    Q_INVOKABLE void addItem(const QString &text) {QComboBox::addItem(text);} 
    Q_INVOKABLE void setItemData(int index, const QVariant &value, int role=Qt::UserRole) {QComboBox::setItemData(index, value, role);} 

    //Custom methods:
    Q_INVOKABLE void setItemBGColor(int index, int color) {
        QComboBox::setItemData(index, QBrush(QRgb(color)), Qt::BackgroundRole);
    }
    Q_INVOKABLE void setItemFGColor(int index, int color) {
        QComboBox::setItemData(index, QBrush(QRgb(color)), Qt::ForegroundRole);
    }

};

Q_SCRIPT_DECLARE_QMETAOBJECT(QComboBoxSC, QWidget*)

class QPushButtonSC : public QPushButton {
    Q_OBJECT
public:
    QPushButtonSC(QWidget *parent) : QPushButton(parent) {}

    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QPushButtonSC, QWidget*)

class QFrameSC : public QFrame {
    Q_OBJECT
public:
    QFrameSC(QWidget *parent) : QFrame(parent) {}

    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
    
    Q_INVOKABLE void setFrameStyle(int style) {QFrame::setFrameStyle(style);}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QFrameSC, QWidget*)

class QSliderSC : public QSlider {
    Q_OBJECT
public:
    QSliderSC(QWidget *parent) : QSlider(parent) {programChanged = false;}
    
    bool programChanged;
    
    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
    
    Q_INVOKABLE void setRange(int min, int max) {QAbstractSlider::setRange(min, max);}
    Q_INVOKABLE void setSingleStep(int value) {QAbstractSlider::setSingleStep(value);}
    Q_INVOKABLE void setPageStep(int value) {QAbstractSlider::setPageStep(value);}
    Q_INVOKABLE void setOrientation(int orientation) {QAbstractSlider::setOrientation((Qt::Orientation)orientation);}
    Q_INVOKABLE void setValue(int value);
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QSliderSC, QWidget*)

class QCheckBoxSC : public QCheckBox {
    Q_OBJECT
public:
    QCheckBoxSC(QWidget *parent) : QCheckBox(parent) {}
    
    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QCheckBoxSC, QWidget*)

class QSpinBoxSC : public QSpinBox {
    Q_OBJECT
public:
    QSpinBoxSC(QWidget *parent) : QSpinBox(parent) {}

    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry (int x, int y, int w, int h) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QSpinBoxSC, QWidget*)

struct XMLReadStatus {
    int mItemCount;
    QTreeWidgetItem *mParentTWIRef;
    int mTreeLevel;
    int mListFloorCounter;
    int mCurrentSrcLine;
    int mCharPos;
};

class tEventForScript : public QObject {
    Q_OBJECT

public:
    tEventForScript(QWidget *parent) : QObject(parent) {
    //    bits.changeindex = 1;
    }

    //tEventForScript(QWidget *parent);
    //~tEventForScript();
/*    struct {
        int changeindex;
    } bits;*/
public:
    //int changeindex;
    
    Q_INVOKABLE void dispatch(int aEventCode);
    
signals:
    void signal(int aEventCode);
};

class tCore {
public:
    tCore();
    ~tCore();
    
    QString mXMLsource;
    QString mXMLFileName;

    bool mBinFileOpened;
    QString mBinFileName;
    
    QList<QDomNode> mItemElmRefTable;
    QList<ItemView*> mItemWiewRefTable;
    QList<QDomNode> mCommonElement;
    QList<quint32> mElementCharStart;
    QList<quint32> mElementCharEnd;
    QList<int> mListElmIndexTable;
    QList<int> mElementArrayIndex;
    
    QByteArray mEditFileFullBuffer;
    
    QByteArray mNESPal;
    
   // BitmapView *bbmmvv;
    
    tEventForScript *mEventForScript;


    
    QString mTypeScriptPath;
    
    int mDRD_intSize;
    int mVersionDate;

    void error(QString aMessage, int aLevel);
    void scriptEnvSetup(QScriptEngine *aEngine, QWidget *aWindowVar, int aElmRefIndex);
    void scriptLoad(QString aFileName, QScriptEngine *aEngine);
    quint32 getItemByte(qint64 aPtr, QDomNode aElmRef);
    qint64 calcItemPtr(qint64 aPtr, QDomNode aElmRef);
    bool itemHasAttr(QString aName, QDomNode aElmRef, bool aCheckCommon = true, bool aCheckRegular = true);
    QString getItemAttr(QString aName, QDomNode aElmRef);
    bool getItemFlag(QString aFlagName, QDomNode aElmRef);
    quint32 getFileByte(qint64 aPtr);
    int setItemByte(qint64 aPtr, quint32 aValue, QDomNode aElmRef);
    int setFileByte(qint64 aPtr, quint32 aValue);
    int getCommonElementIndex(QDomNode aElmRef);
    
    QDomNode getEngineElmRef(QScriptEngine *aEngine);

};

extern tCore Core;

class MainWindow : public QMainWindow
{
    Q_OBJECT
    
public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();
    
    void dev_init_();
    void dev_init_SRFX_();
    void loadXML();
    void loadXMLRecursive();
    void loadXMLRecursive(QDomNode aNode, XMLReadStatus *aStatus);
private slots:
    void on_wTree_currentItemChanged(QTreeWidgetItem *current, QTreeWidgetItem *previous);
    
    void on_wTree_itemClicked(QTreeWidgetItem *item, int column);
    void on_actionOpenXML_triggered();
    
    void on_actionOpenBinary_triggered();
    
    void on_actionSaveBinary_triggered();
    
    void on_actionExit_triggered();
    
    void on_mdiArea_subWindowActivated(QMdiSubWindow *arg1);
    
public:
    
    void loadBinFile(QString aFName, int aMode);
    void loadXMLFile(QString aFName);
    void dev_init_combo_(QString aXML, QString aBIN);
    void load_NES_Palette(QString aFName);
    void selectXMLfile();
    void selectBinFile();
    bool loadFileCommon(QString aFName, QByteArray *aByteArray);
    void saveBinFile(QString aFName);
    void unloadXML();
    void init();
    void updateWindowTitle();
    
    void closeEvent(QCloseEvent *aCEvent);
    

private:
    Ui::MainWindow *ui;
};

#endif // MAINWINDOW_H
