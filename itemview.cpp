#include "itemview.h"
#include "ui_itemview.h"
#include "script.h"

#include "mainwindow.h"

#include <QFile>
#include <QTextStream>
#include <QMessageBox>
#include <QFileInfo>

ItemView::ItemView(QWidget *parent) :
    ItemViewWindow(parent),
    ui(new Ui::ItemView)
{
    mElementRef = -1;
    ui->setupUi(this);
    
}

void ItemView::focusInEvent(QFocusEvent *aEventData) {
    ItemViewWindow::focusInEvent(aEventData);
}

void ItemView::showEvent(QShowEvent *aEventData) {
    ItemViewWindow::showEvent(aEventData);
}

void ItemView::closeEvent(QCloseEvent *aEventData) {
    Core.mItemElmTable[mElementRef].mItemViewRef = 0;
    #ifdef SUBWINDOWTYPE
    #endif
    ItemViewWindow::closeEvent(aEventData);
}

void ItemView::initTypeScript() {
    
    if (Core.itemHasAttr("window.stylesheet", Core.mItemElmTable[mElementRef].mElmRef, true, true) == true) {
        setStyleSheet(Core.getItemAttr("window.stylesheet", Core.mItemElmTable[mElementRef].mElmRef));
    } else {
        int vStyleIx = Core.mCustomizeId.indexOf("window.stylesheet");
        if (vStyleIx >= 0) {
           setStyleSheet(Core.mCustomizeString[vStyleIx]);
        }
    }
    
    setLayout(ui->verticalLayout);
    
    QString vNiceText;
    int vA = Core.mItemElmTable[mElementRef].mCharStart;
    int vB = Core.mItemElmTable[mElementRef].mCharEnd;
    vNiceText = Core.mXMLSource.mid(vA, vB-vA);
    ui->wXMLedit->setPlainText(vNiceText);
    ui->wXMLedit->hide();
    
 /*   QString vType;
    
    if (Core.itemHasAttr("type", Core.mItemElmTable[mElementRef].mElmRef) == true) {
        vType = Core.getItemAttr("type", Core.mItemElmTable[mElementRef].mElmRef);
    } else {
        vType = "blank";
    }
    
    QString vTypeFile = vType + ".js";
    QString vTypeFileFull = Core.mTypeScriptPath + vTypeFile;
    
    QFileInfo vFI;
    vFI.setFile(vTypeFileFull);
    if (vFI.exists() == false) {
        QMessageBox vErrorBox;
        QString vError = "Couldn't find script file for data type: " + vTypeFile;
        vErrorBox.setText(vError);
        vErrorBox.exec();
        vTypeFileFull = Core.mTypeScriptPath + "blank.js";
    }


    Core.scriptLoad(vTypeFileFull, &mScriptEngine);
    */
    
    Core.initTypeScript(mElementRef, &mScriptEngine);
    scriptEnvSetup(&mScriptEngine, this->ui->widget, mElementRef);
        
    QScriptValue vGlob = mScriptEngine.globalObject();
    QScriptValue vInitFunc = vGlob.property("init");
   
    vInitFunc.call();
    if (mScriptEngine.hasUncaughtException()) {
        QMessageBox vErrorBox;
        QString vError;
        vError = mScriptEngine.uncaughtException().toString();
        vErrorBox.setText(vError);
        vErrorBox.exec();
        return;
    }
   
   
}

ItemView::~ItemView()
{
    delete ui;
}
