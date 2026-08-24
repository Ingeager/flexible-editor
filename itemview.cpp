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
    for (int vRenderEng = 0; vRenderEng < Core.mRenderScriptEngine.count(); vRenderEng++) {
        delete Core.mRenderScriptEngine[vRenderEng];
    }
    Core.mRenderScriptEngine.clear();
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
    
    bool vGroup = Core.mItemElmTable[mElementRef].mIsGroup;
    if (vGroup) {
        QList<int> vList = Core.mItemElmTable[mElementRef].mChildIndexes;
        int vX = 15;
        int vY = 12;
        for (int vIx = 0; vIx < vList.count(); vIx++) {
            //int vRenderEngCount = Core.mRenderScriptEngine.count();
            QScriptEngine *vEngine = new QScriptEngine;
            Core.mGroupScriptEngine.append(vEngine);
            
            int vChildElmRef = vList[vIx];
            Core.initTypeScript(vChildElmRef, vEngine);
            scriptEnvSetup(vEngine, this->ui->widget, vChildElmRef);
            
            QScriptValue vGlob = vEngine->globalObject();
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
            
            vY = vGlob.property("base_y").toInt32() + 10;
            vX = vGlob.property("base_x").toInt32();

        }
    }
    
   
}

ItemView::~ItemView()
{
    delete ui;
}
