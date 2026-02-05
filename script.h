
#ifndef SCRIPT_H
#define SCRIPT_H

#include <QMainWindow>
#include <QScriptEngine>

#include <QLabel>
#include <QLineEdit>
#include <QPlainTextEdit>
#include <QComboBox>
#include <QPushButton>
#include <QSlider>
#include <QFrame>
#include <QCheckBox>
#include <QSpinBox>
#include <QGraphicsView>
#include <QTimer>


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

class QPlainTextEditSC : public QPlainTextEdit {
    Q_OBJECT
public:
    QPlainTextEditSC(QWidget *parent) : QPlainTextEdit(parent) {}
    QPlainTextEditSC(const QString &contents, QWidget *parent = 0) : QPlainTextEdit(contents, parent) {}
    
    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QPlainTextEditSC, QWidget*)

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

class QTimerSC: public QTimer {
    Q_OBJECT
public:
    QTimerSC(QObject *parent) : QTimer(parent) {}
};

Q_SCRIPT_DECLARE_QMETAOBJECT(QTimerSC, QWidget*)



class BitmapView : public QGraphicsView {
    Q_OBJECT

public:
    BitmapView(QWidget *parent) : QGraphicsView(parent) {}
    //~BitmapView();

    QPixmap mPixmap;
    QImage mImage;
    QGraphicsScene mScene;
    
    void mousePressEvent(QMouseEvent *event);
    void mouseMoveEvent(QMouseEvent *event);

    Q_INVOKABLE void init(int aWidth, int aHeight);
    
    //Note: This is repeated for every class.. I can't find a way to compress it.
    //Things like Q_INVOKABLE and "public slot" is handled by moc, but moc does not expand macros,
    //so I can't use a macro for it.
    
    Q_INVOKABLE void move(int x, int y) {QWidget::move(x, y);} 
    Q_INVOKABLE void setGeometry ( int x, int y, int w, int h ) {QWidget::setGeometry(x, y, w, h);}
    Q_INVOKABLE void resize(int w, int h) {QWidget::resize(w, h);}
    
    
   // Q_INVOKABLE int height() {return QWidget::height();}
   
    Q_INVOKABLE void setPixel(int aY, int aX, int aValue);
    Q_INVOKABLE void drawLineX(int aY, int aX1, int aX2, int aValue);
    Q_INVOKABLE void drawLineY(int aY1, int aY2, int aX, int aValue);
    Q_INVOKABLE void drawBox(int aY1, int aY2, int aX1, int aX2, int aValue);
    Q_INVOKABLE void drawBuffer(int aY1, int aY2, int aX1, int aX2, QVariantList aBuffer);
    
    Q_INVOKABLE void refresh();

signals:
    void mousePress(int aButtons, int aY, int aX);
    void mouseMove(int aButtons, int aY, int aX);
};

Q_SCRIPT_DECLARE_QMETAOBJECT(BitmapView, QWidget*)



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


extern void scriptEnvSetup(QScriptEngine *aEngine, QWidget *aWindowVar, int aElmRefIndex );

#endif
