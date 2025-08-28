#include "itemview.h"
#include "ui_itemview.h"

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
    
    QString vType;
    
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
    
    Core.scriptEnvSetup(&mScriptEngine, this->ui->widget, mElementRef);
    
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
    
    setLayout(ui->verticalLayout);
    
    QString vNiceText;
    int vA = Core.mItemElmTable[mElementRef].mCharStart;
    int vB = Core.mItemElmTable[mElementRef].mCharEnd;
    vNiceText = Core.mXMLsource.mid(vA, vB-vA);
    ui->wXMLedit->setPlainText(vNiceText);
   
}

ItemView::~ItemView()
{
    delete ui;


}
