#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QDomDocument>

#include <QFile>
#include <QTextStream>
#include <QLineEdit>
#include <QPoint>
#include <QRgb>
#include <QFileDialog>
#include <QMessageBox>
#include <qmath.h>
#include <QTextCodec>
#include <QMetaProperty>


tCore Core;


tCore::tCore() {
    mEventForScript = new tEventForScript(0);
    
    mDRD_intSize = 16;
    
    mVersionDate = 260226;
    
    mBinFileOpened = false;
    mBinFileName = "";
    mBufferSystem = eBufferSystem_Single; //Overwritten on file open

    mXMLFileOpened = false;
    mXMLEditIndex = -1;
    mXMLSourceHasEditBackup = false;
    
    mLowLevelErrorFlag = false;
    
    mBaseOffset = 0;
    

}

tCore::~tCore() { }



void tCore::error(QString aMessage, int aLevel) {
    if (aLevel == 1) {
        if (Core.mLowLevelErrorFlag == true) {
            return;
        }
        Core.mLowLevelErrorFlag = true;
    }
    
    QMessageBox vErrorBox;
    vErrorBox.setWindowTitle(Core.getConfigStr("programTitle"));
    vErrorBox.setWindowIcon(Core.mDefaultIcon);
    vErrorBox.setText(aMessage);
    vErrorBox.setIcon(aLevel < 3 ? QMessageBox::Warning : QMessageBox::Critical);
    vErrorBox.exec();
}

bool tCore::qElementGetHasAttribute(QDomElement aElement, QString aName, QString *aReturnStr) {
    if (aElement.hasAttribute(aName.toLower())) {*aReturnStr = aElement.attribute(aName.toLower()); return true;}
    if (aElement.hasAttribute(aName.toUpper())) {*aReturnStr = aElement.attribute(aName.toUpper()); return true;}
    return false;
}

int tCore::getEngineElmIndex(QScriptEngine *aEngine) {
    QScriptValue vGlob = aEngine->globalObject();
    QScriptValue vCore = vGlob.property("Core");
    return(vCore.property("elmRefIndex").toInteger());
}

QDomElement tCore::getEngineElmRef(QScriptEngine *aEngine) {
    QScriptValue vGlob = aEngine->globalObject();
    QScriptValue vCore = vGlob.property("Core");
    int vIndex = vCore.property("elmRefIndex").toInteger();
    return(Core.mItemElmTable[vIndex].mElmRef);
}

quint32 tCore::getFileByte(qint64 aPtr) {
    if (Core.mBinFileOpened == false) {return 0;}
    if (aPtr < 0) {
        Core.error("Read pointer negative: -0x" + QString::number(qAbs(aPtr), 16), 1);
        return 0;
    }
    if (Core.mBufferSystem == eBufferSystem_Single) {
        quint32 vPtr = aPtr;
        if (vPtr < mEditFileFullBuffer.size()) {
        return ((uchar)mEditFileFullBuffer[vPtr]);
        } else {
           Core.error("Read past binary size: 0x" + QString::number(vPtr, 16), 1);
           return 0;
        }
    } else if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        if (aPtr < mLockedBinQFile.size()) {
            if (mBufferBlockLocations.count() > 0) {
                quint64 vBlockPos = qFloor(aPtr / Core.mBufferBlockSize);
                qint32 vBlockIndex = -1;
                if ((vBlockIndex = mBufferBlockLocations.indexOf(vBlockPos)) >= 0) {
                    //Read from buffer
                    quint32 vSubByteIndex = aPtr % Core.mBufferBlockSize;
                    return((uchar)mBufferBlockData[vBlockIndex][vSubByteIndex] );
                }
            } 
            //Read directly from file
            char vChar;
            mLockedBinQFile.seek(aPtr);
            mLockedBinQFile.getChar(&vChar);
            return (uchar)vChar;

        } else {
            Core.error("Read past file size: 0x" + QString::number(aPtr, 16), 1);
            return 0;
        }
    } else {
        return 0;
    }
    
}

void tCore::setFileByte(qint64 aPtr, quint32 aValue) {
    if (Core.mBinFileOpened == false) {return;}
    if (aPtr < 0) {
        Core.error("Write pointer negative: -0x" + QString::number(qAbs(aPtr), 16), 1);
        return;
    }
    if (Core.mBufferSystem == eBufferSystem_Single) {
        quint32 vPtr = aPtr;
        if (vPtr < mEditFileFullBuffer.size()) {
        mEditFileFullBuffer[vPtr] = aValue;
        } else {
          Core.error("Write past binary size: 0x" + QString::number(vPtr, 16), 1);
        }
    } else if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
    
        if (aPtr >= mLockedBinQFile.size()) {
            Core.error("Write past binary size: 0x" + QString::number(aPtr, 16), 1);
            return;   
        }
        qint32 vBlockIndex = -1;
        quint32 vSubByteIndex = aPtr % Core.mBufferBlockSize;
        quint64 vBlockPos = qFloor(aPtr / Core.mBufferBlockSize);
        if (mBufferBlockLocations.count() > 0) {
            vBlockIndex = mBufferBlockLocations.indexOf(vBlockPos);
        }
        if (vBlockIndex < 0) {
            QByteArray vBA;
            quint64 vBlockStartPtr = quint64(vBlockPos) * Core.mBufferBlockSize;
            mLockedBinQFile.seek(vBlockStartPtr);
            vBA = mLockedBinQFile.read(Core.mBufferBlockSize);
            vBlockIndex = mBufferBlockData.count();
            mBufferBlockData.append(vBA);
            mBufferBlockLocations.append(vBlockPos);
        }
        mBufferBlockData[vBlockIndex][vSubByteIndex] = aValue;
    }
}

quint32 tCore::getItemByte(qint32 aPtr, QDomElement aElmRef, int aElmIndex) {
    return(getFileByte(calcItemPtr(aPtr, aElmRef, aElmIndex, true)));
}

void tCore::setItemByte(qint32 aPtr, quint32 aValue, QDomElement aElmRef, int aElmIndex) {
    setFileByte(calcItemPtr(aPtr, aElmRef, aElmIndex, true), aValue);
}

void tCore::saveXML() {
    QFile vFile;
    vFile.setFileName(Core.mXMLFileName);
    vFile.open(QIODevice::WriteOnly);
    vFile.seek(0);
    QByteArray vByteData = Core.mXMLSource.toUtf8();
    vFile.write(vByteData.constData(), vByteData.length());
    vFile.close();
}

//Load a text document as UTF-8 if it contains valid characters,
//otherwise load as ASCII.

bool tCore::loadDocument(QString aFileName, QString *aDocument) {
    QFile vQFile(aFileName);

    if (!vQFile.open(QIODevice::ReadOnly)) {
        return false;
    }
    *aDocument = "";
    
    QByteArray vDocByteArr;
    vQFile.seek(0);
    vDocByteArr = vQFile.readAll();
    vQFile.close();
    
    QTextCodec::ConverterState vCState;
    QTextCodec *vCodec = QTextCodec::codecForName("UTF-8"); 
    *aDocument = vCodec->toUnicode(vDocByteArr.constData(), vDocByteArr.size(), &vCState);
    if (vCState.invalidChars > 0) {
        *aDocument = vDocByteArr;
    }
    return true;
}

void tCore::initTypeScript(int aElementRef, QScriptEngine *aEngine) {
    QString vType;
    
    if (Core.itemHasAttr("type", Core.mItemElmTable[aElementRef].mElmRef) == true) {
        vType = Core.getItemAttr("type", Core.mItemElmTable[aElementRef].mElmRef);
    } else {
        vType = "blank";
    }
    
    QString vTypeFile = vType + ".js";
    QString vTypeFileFull = Core.getConfigStr("typeScriptPath") + vTypeFile;
    
    QFileInfo vFI;
    vFI.setFile(vTypeFileFull);
    if (vFI.exists() == false) {
        QMessageBox vErrorBox;
        QString vError = "Couldn't find script file for data type: " + vTypeFile;
        vErrorBox.setText(vError);
        vErrorBox.exec();
        vTypeFileFull = Core.getConfigStr("typeScriptPath") + "blank.js";
    }


    Core.scriptLoad(vTypeFileFull, aEngine);
    
}

void tCore::scriptLoad(QString aFileName, QScriptEngine *aEngine) {
    QString vContents = "";
    
    if (!Core.loadDocument(aFileName, &vContents)) {
        Core.error("Error: Could not load script " + aFileName, 3);
        return;
    }
    
    QString vIncludeTagStr = "FLEX_INCLUDE";
    int vIncludeTag = vContents.indexOf(vIncludeTagStr);
    while (vIncludeTag >= 0) {
        int vCPA = vContents.indexOf('"', vIncludeTag) + 1;
        int vCPB = vContents.indexOf('"', vCPA);
        QString vFile = vContents.mid(vCPA, vCPB - vCPA);
        vFile.prepend(Core.getConfigStr("typeScriptPath"));
        Core.scriptLoad(vFile, aEngine);
        vIncludeTag = vContents.indexOf(vIncludeTagStr, vCPB);
    }
    
    aEngine->evaluate(vContents, aFileName);
    if (aEngine->hasUncaughtException()) {
        return;
    }
}

bool tCore::loadFileCommon(QString aFName, QByteArray *aByteArray) {
    QFile vFile;
    vFile.setFileName(aFName);
    bool vResult = vFile.open(QIODevice::ReadOnly);
    if (vResult == true) {
        vFile.seek(0);
        *aByteArray = vFile.readAll();
        vFile.close();
        return true;
    } else {
        Core.error("Failed to load: " + aFName, 2);
        return false;
    }
}

int tCore::getCommonElementIndex(QDomElement aElmRef) {
    if (itemHasAttr("common", aElmRef) == true) {
        QString vLookForKey = getItemAttr("common", aElmRef);
        int vCommonElementNum = Core.mCommonElmIndexTable.count();
        if (vCommonElementNum > 0) {
            
            int vIx = 0;
            while(vIx < vCommonElementNum) {
                int vElmIndex = Core.mCommonElmIndexTable[vIx];
                QString vKey = "";
                //Fix 25-12-23: Now detects both lowercase and uppercase "key" attribute.
                Core.qElementGetHasAttribute(mItemElmTable[vElmIndex].mElmRef, "key", &vKey);
                if (vKey.compare(vLookForKey, Qt::CaseInsensitive) == 0) {
                    return vIx;
                }
                vIx++;
            }
        }
        Core.error("Could not find COMMON Element \"" + vLookForKey + "\"", 1);
    }

    return -1;
}

bool tCore::itemHasAttr(QString aName, QDomElement aElmRef, bool aCheckCommon, bool aCheckRegular) {
    QDomNamedNodeMap vAttr = aElmRef.attributes();
    if (aCheckRegular == true) {
        if (vAttr.contains(aName.toUpper())) {return true;}
        if (vAttr.contains(aName.toLower())) {return true;}
    }

    if (aCheckCommon == true) {
        //Don't look for "common" in a common. (Infinite recursion otherwise)
        if (aName.compare("common", Qt::CaseInsensitive) != 0) { 
        //Also, if this Element is a "common", don't continue (prevent infinite recursion).
        if (aElmRef.nodeName().compare("common", Qt::CaseInsensitive) != 0) {
            int vIndex = getCommonElementIndex(aElmRef);
            if (vIndex >= 0) {
                int vElmIndex = Core.mCommonElmIndexTable[vIndex];
                return itemHasAttr(aName, Core.mItemElmTable[vElmIndex].mElmRef, false, true);
            }
        }
        }
    }

    return false;
}

QString tCore::getItemAttr(QString aName, QDomElement aElmRef) {
    
    QDomElement vElmRef = aElmRef;
    bool vPass = false;
    if (itemHasAttr(aName, aElmRef, false, true) == true) {
        vPass = true;
        goto found;
    }
    
    if (itemHasAttr(aName, aElmRef, true, false) == true) {
        int vIndex = getCommonElementIndex(aElmRef);
        int vElmIndex = mCommonElmIndexTable[vIndex];
        vElmRef = mItemElmTable[vElmIndex].mElmRef;
        vPass = true;
    }
 
 found:
    if (vPass == false) {return "";}

    QString vValue = "";
    QDomNamedNodeMap vAttr = vElmRef.attributes();
    QDomNode vAttrValLC = vAttr.namedItem(aName.toLower());
    QDomNode vAttrValUC = vAttr.namedItem(aName.toUpper());
    if (!vAttrValLC.isNull()) {vValue = vAttrValLC.nodeValue();}
    if (!vAttrValUC.isNull()) {vValue = vAttrValUC.nodeValue();}
    return (vValue);
}

bool tCore::getItemFlag(QString aFlagName, QDomElement aElmRef) {
    QString vFlagAttr = Core.getItemAttr("flag", aElmRef);
    if (vFlagAttr.size() > 0) {
        QStringList vFlags = vFlagAttr.split(".", QString::SkipEmptyParts);
        int vIndex = 0;
        while (vIndex < vFlags.size()) {
            if (vFlags[vIndex].compare(aFlagName, Qt::CaseInsensitive) == 0) {
                return true;
            }
            vIndex++;
        }
    }
    return false;
}

qint64 tCore::calcItemPtr(qint32 aPtr, QDomElement aElmRef, int aElmIndex, bool aCheckBigEndian) {
    
    if (aElmIndex >= 0) {
        if (aCheckBigEndian == true) {
            //Check for BigEndian setting
            qint32 vByteSize = mItemElmTable[aElmIndex].mBigEndianByteSz;
            if (vByteSize > 0) {
                aPtr = (qFloor(aPtr / vByteSize)*vByteSize) + (vByteSize-1-(aPtr % vByteSize));
            }
        }
        
        //Add array index
        aPtr += (mItemElmTable[aElmIndex].mArrayIndex*mItemElmTable[aElmIndex].mArrayByteSz);
    }
    //Work in 64-bit mode from here.
    qint64 vWorkPtr = aPtr;
    //Add relative base offset.
    vWorkPtr += mBaseOffset;
    
    // "ptr" is absolute. No deeper search is needed.
    if (itemHasAttr("ptr", aElmRef)) {
        vWorkPtr += getItemAttr("ptr", aElmRef).toULongLong(0, 16);
        goto ptrFinishCalc;
    }
    if (itemHasAttr("relptr", aElmRef)) {
        vWorkPtr += getItemAttr("relptr", aElmRef).toULongLong(0, 16);
    }
    
    {
        QDomNode vParent = aElmRef.parentNode();
        if (vParent.isNull() == false) {
        if (vParent.isElement()) {
            int vParentIndex = -1;
            if (aElmIndex >= 0) {
                vParentIndex = mItemElmTable[aElmIndex].mParentIndex;
            }
            vWorkPtr += calcItemPtr(0, vParent.toElement(), vParentIndex, false);
        }
        }
    }

ptrFinishCalc:

    return (vWorkPtr);
}  

bool tCore::findIncludeFile(QString *aFName) {
    QFileInfo vFI;
    vFI.setFile(*aFName);
    if (vFI.isAbsolute() == true) {
        //Absolute
        return vFI.exists();
    }
    QString vRelativeFile = Core.mXMLFileBasePath + *aFName;
    vFI.setFile(vRelativeFile);
    if (vFI.exists()) {
        //Relative to XML file path.
        *aFName = vRelativeFile;
        return true;
    }
    QString vScriptRelativeFile = Core.getConfigStr("typeScriptPath") + *aFName;
    vFI.setFile(vScriptRelativeFile);
    if (vFI.exists()) {
        //Relative to Script path
        *aFName = vScriptRelativeFile;
        return true;
    }
    vFI.setFile(*aFName);
    if (vFI.exists()) {
        //Relative to app path.
        return true;
    }

    return false;
}


void tCore::loadConfig() {

    //Set default settings
    mConfig.setProperty("programTitle", "Flexible Editor");
    mConfig.setProperty("typeScriptPath", "Script/Type/");
    mConfig.setProperty("theme", "icedragon");
    mConfig.setProperty("NESPaletteFile", "fr_nesB.pal");
    mConfig.setProperty("autoLoadXMLFile", "demo.xml");
    mConfig.setProperty("autoLoadBINFile", "demo.bin");
    mConfig.setProperty("bufferBlockSize", 4096);
    
    bool vOk = false;
    QFile vCfgFile("FlexibleEdit.cfg");
    
    if (vCfgFile.exists() == true) {
        if (vCfgFile.open(QIODevice::ReadOnly|QIODevice::Text) == true) {
            vOk = true;
        } else {
            Core.error("Failed to open existing config file.", 3);
        }
    }
    
    if (vOk == true) {
        vCfgFile.seek(0);
        
        QTextStream vStream(&vCfgFile);
        
        while (vStream.atEnd() == false) {
            QString vLine = vStream.readLine();
            int vEqPos = vLine.indexOf('=');
            if ((vEqPos > 0) && ((vEqPos+1) < vLine.length())) {
                QString vLeftSide = vLine;
                vLeftSide.truncate(vEqPos);
                QString vRightSide = vLine.mid(vEqPos+1, -1);
                if ((vLeftSide.trimmed().isEmpty() == false) && (vRightSide.trimmed().isEmpty() == false)) {
                    Core.mConfig.setProperty(vLeftSide.toAscii(), vRightSide);
                }
            }
        }
        vCfgFile.close();
            
    } else {

        
    }
}

void tCore::saveConfig() {
    
    QFile vCfgFile("FlexibleEdit.cfg");
    if (vCfgFile.open(QIODevice::WriteOnly|QIODevice::Text) == true) {
        vCfgFile.seek(0);

        QTextStream vStream(&vCfgFile);
        QList<QByteArray> vList = mConfig.dynamicPropertyNames();
        
        for (int index = 0; index < vList.count(); index++) {
            QByteArray vLeftSide = vList.at(index);
            QString vRightSide = mConfig.property(vLeftSide).toString();
            QString vConfigLine = vLeftSide + "=" + vRightSide + "\n";
            vStream << vConfigLine;
        }
        vCfgFile.close();
        
    } else {
        Core.error("Failed to save config.", 3);
    }
    
}

QString tCore::getConfigStr(QByteArray aProperty) {
    return mConfig.property(aProperty).toString();
}

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    
    ui->setupUi(this);
    
    init();
    
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::disableDirectEdit() {
    ui->wUpdate->setEnabled(false);
    ui->wXMLEdit->setEnabled(false); 
}

void MainWindow::updateWindowTitle() {
    QString vTitle = Core.getConfigStr("programTitle") + " (build " + QString::number(Core.mVersionDate) + ")";
    if (Core.mBinFileOpened == true) {
        vTitle += " - " + Core.mBinFileName; 
    }
    vTitle += " - " + Core.mXMLFileName;
    setWindowTitle(vTitle);
}

void MainWindow::closeEvent(QCloseEvent *aCEvent) {
    QMainWindow::closeEvent(aCEvent);
    unloadXML();
    if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        Core.mLockedBinQFile.close();
    }
    
    Core.saveConfig();
}

void MainWindow::init() {
  //mXMLmenu.addAction("Insert Item..", this, SLOT(on_insertItem()));
  //mXMLmenu.addAction("Delete Item", this, SLOT(on_deleteItem());
 
    #ifdef QT_DEBUG
    Core.mBenchmarkTime.start(); 
    #endif
    
    Core.loadConfig();
    
    Core.mBufferBlockSize = Core.mConfig.property("bufferBlockSize").toInt();
    
    themeChange();
    
    load_NES_Palette(Core.getConfigStr("NESPaletteFile"));
    
    Core.mDefaultIcon = QIcon("testlogo.png");
    setWindowIcon(Core.mDefaultIcon);
  
    #ifndef QT_DEBUG
    QString vAutoLoadXMLFile = Core.getConfigStr("autoLoadXMLFile");
    QString vAutoLoadBINFile = Core.getConfigStr("autoLoadBINFile");
    loadXMLFile(vAutoLoadXMLFile);
    loadBinFile(vAutoLoadBINFile, eBufferSystem_Single);
    #else
    dev_init_();
    #endif
    
    ui->centralWidget->setLayout( ui->horizontalLayout );
    ui->mainToolBar->hide();
    ui->actionImport_XML->setVisible(false);
    
    disableDirectEdit();

    updateWindowTitle();
}

void MainWindow::selectXMLfile() {
  QString vFile;
  vFile = QFileDialog::getOpenFileName(this, "Open XML file", QString(), "XML document (*.xml)");
  if (vFile.size() > 0) {
    loadXMLFile(vFile);
  }
}

void MainWindow::selectBinFile(bool aForceBufferMode) {
    int vBufMode = (aForceBufferMode == false ? eBufferSystem_Single : eBufferSystem_WriteBuffer);
    QString vFile;
    vFile = QFileDialog::getOpenFileName(this, "Open data file", QString());
    if (vFile.size() > 0) {
        loadBinFile(vFile, vBufMode);
    }
}

void MainWindow::dev_init_() {

    int vBufferMode = eBufferSystem_WriteBuffer;
    dev_init_combo_("demo.xml", "demo.bin", vBufferMode);
  //  dev_init_combo_("demo_high.xml", "j:/vx", vBufferMode);
    
    //Core.mBinFileName = "debug_save.bin";
  //  Core.mXMLFileName = "debug_save.xml";

   // dev_init_combo_("C:/romhacking/tools/DRDHack/srfx.xml", "C:/romhacking/tools/DRDHack/stuntracefx.smc", vBufferMode);
   // dev_init_combo_("C:/romhacking/tools/DRDHack/bc.xml", "C:/romhacking/tools/DRDHack/bc.nes");
   //dev_init_combo_("C:/work/mm4ex/megaman4.xml", "D:/roms/nes/Mega Man 4 (U).nes", vBufferMode);
    //dev_init_combo_("C:/web/geocities/megaman5.xml", "D:/roms/nes/Mega Man 5 (U).nes");
  // dev_init_combo_("XML/Mega Man 5 (NES).xml", "D:/roms/nes/Mega Man 5 (U).nes", vBufferMode);
   // dev_init_combo_("XML/Magic Sword (SNES).xml", "C:/work/magicsword/ms_clean.sfc", vBufferMode);
}

void MainWindow::dev_init_combo_(QString aXML, QString aBIN, int aBufferMode) {
    loadXMLFile(aXML);
    loadBinFile(aBIN, aBufferMode);
}

void MainWindow::unloadXML() {
    disableDirectEdit();
    ui->wTree->clear();
    ui->mdiArea->closeAllSubWindows();
    Core.mItemElmTable.clear();
    Core.mCommonElmIndexTable.clear();
    Core.mListElmIndexTable.clear();
    Core.mIconTable.clear();
    Core.mMainXML.setContent(QString(""));
}

void MainWindow::loadBinFile(QString aFName, int aMode) {

    if (aMode == eBufferSystem_Single) {
        QFileInfo vFI;
        vFI.setFile(aFName);
        quint64 vFileSize = vFI.size();
        if (vFileSize > 300000000) {
            int vResult = QMessageBox::question(this, Core.getConfigStr("programTitle"), \
            "The file is larger than 300MB. Do you wish to open it in Write Buffer mode?\n(Loading might fail otherwise)", 
            QMessageBox::Yes|QMessageBox::No, QMessageBox::No);
            if (vResult == QMessageBox::Yes) {
                aMode = eBufferSystem_WriteBuffer;
            }
        }
    }

    ui->mdiArea->closeAllSubWindows();
    if (Core.mEditFileFullBuffer.size() > 0) {
        Core.mEditFileFullBuffer.clear();
    }
    if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        Core.mLockedBinQFile.close();
        Core.mBufferBlockData.clear();
        Core.mBufferBlockLocations.clear();
    }
    Core.mBinFileOpened = false;
    Core.mBinFileName = "";

    if (aMode == eBufferSystem_Single) {
        bool vResult = Core.loadFileCommon(aFName, &Core.mEditFileFullBuffer);
        if (vResult == true) {
            Core.mBinFileOpened = true;
            Core.mBinFileName = aFName;
            Core.mBufferSystem = eBufferSystem_Single;
            ui->actionSaveBinary->setEnabled(true);
        } else {
            //Error message given in loadFileCommon.
        }
        
        updateWindowTitle();
    } else if (aMode == eBufferSystem_WriteBuffer) {
        Core.mLockedBinQFile.setFileName(aFName);
        bool vResult = Core.mLockedBinQFile.open(QIODevice::ReadWrite);
        if (vResult == true) {
            Core.mBinFileOpened = true;
            Core.mBinFileName = aFName;
            Core.mBufferSystem = eBufferSystem_WriteBuffer;
        } else {
            Core.error("Failed to open: " + aFName + " in Write Buffer mode.", 2);
        }

        updateWindowTitle();
    }
    
    if (Core.mBinFileOpened == true) {
        ui->actionSaveBinary->setEnabled(true);
    } else {
        ui->actionSaveBinary->setEnabled(false); 
    }
}

void MainWindow::saveBinFile(QString aFName) {
    if (aFName.size() <= 0) {return;}
    if (Core.mBinFileOpened == false) {return;}
    
    if (Core.mBufferSystem == eBufferSystem_Single) {
        if (Core.mEditFileFullBuffer.size() <= 0) {return;}
        QFile vFile;
        vFile.setFileName(aFName);
        bool vSuccess = vFile.open(QIODevice::WriteOnly);
        if (vSuccess) {
            vFile.seek(0);
            vFile.write(Core.mEditFileFullBuffer);
            vFile.close();
        } else {
            Core.error("Couldn't save to " + aFName, 2);
        }
        
    } else if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        if (Core.mBufferBlockLocations.size() > 0) {
            quint64 vFileSize = Core.mLockedBinQFile.size();
            for (int vBlock = 0; vBlock < Core.mBufferBlockLocations.size(); vBlock++) {
                quint64 vBlockStart = quint64(Core.mBufferBlockLocations[vBlock])*Core.mBufferBlockSize;
                Core.mLockedBinQFile.seek(vBlockStart);
                quint64 vWriteLen = Core.mBufferBlockSize;
                if ((quint64(Core.mBufferBlockSize)+vBlockStart) > vFileSize) {
                    vWriteLen = (vFileSize-vBlockStart);
                }
                Core.mLockedBinQFile.write(Core.mBufferBlockData[vBlock], vWriteLen);
            }
            //Close and re-open file for writes to be reflected.
            Core.mLockedBinQFile.close();
            bool vResult = Core.mLockedBinQFile.open(QIODevice::ReadWrite);
            
            if (vFileSize != Core.mLockedBinQFile.size()) {
                Core.error("Error: File size changed after save! (This means there's a bug in code)", 3);
            }
            
            Core.mBufferBlockData.clear();
            Core.mBufferBlockLocations.clear();
        }
    }
}

void MainWindow::load_NES_Palette(QString aFName) {
    Core.loadFileCommon(aFName, &Core.mNESPal);
}


void MainWindow::loadXMLFile(QString aFName) {
    unloadXML();

    Core.loadDocument(aFName, &Core.mXMLSource);
    loadXML_L2(aFName);
}

//Called from loadXMLFile, and when creating a new XML file.
//Assumes Core.mXMLsource and contents of the physical file is in correct state.

void MainWindow::loadXML_L2(QString aFName) {

    Core.mXMLFileName = aFName;
    int vPos1 = aFName.lastIndexOf('/');
    int vPos2 = aFName.lastIndexOf('\\');
    if (vPos1 >= 0) {
        Core.mXMLFileBasePath = aFName;
        Core.mXMLFileBasePath.truncate(vPos1+1);
    } else if (vPos2 >= 0) {
        Core.mXMLFileBasePath = aFName;
        Core.mXMLFileBasePath.truncate(vPos2+1);    
    } else {
        Core.mXMLFileBasePath = "";
    }
    
    loadXML_L3();
    updateWindowTitle();
    
    Core.mXMLFileOpened = true;
}

//Called directly to reload the XML when it's been modified in the program.
void MainWindow::loadXML_L3() {

    QString vErrMsg = "";
    bool vHasError = false;
    
    QString vError;
    int vErrorLine;
    int vErrorCol;
    
    bool vResult = Core.mMainXML.setContent(Core.mXMLSource, &vError, &vErrorLine, &vErrorCol);
    
    if (vResult == false) {
        vHasError = true;
        vErrMsg = "XML Parse error (Line " + QString::number(vErrorLine) + ", Col " + QString::number(vErrorCol) + "): " + vError; 
    }
    
    //QXmlStreamReader some times reports other errors, so detect those too before loading.
    if (vHasError == false) {
        QXmlStreamReader vReader;
        vReader.addData(Core.mXMLSource);
        int vToken = -1;
        int vSafeCount = 0;
        while ((vReader.atEnd() != true) && (vToken != QXmlStreamReader::EndDocument) && (vSafeCount < 10000)) {
            vToken = vReader.readNext();
            vSafeCount++;
            if (vReader.hasError() == true) {
                vHasError = true;
                vErrMsg = "QXmlStreamReader reported error at Line ";
                vErrMsg += QString::number(vReader.lineNumber());
                vErrMsg += ", Collumn " + QString::number(vReader.columnNumber());
                vErrMsg += ":\n" + vReader.errorString();
                break;
            }
        }
    }

    if (vHasError == true) {
        if (Core.mXMLSourceHasEditBackup == true) {
            vErrMsg += ".\nDo you want to undo the latest edit?";
            int vResult = QMessageBox::question(this, Core.getConfigStr("programTitle"), \
                vErrMsg, QMessageBox::Yes|QMessageBox::No, QMessageBox::Yes);
            if (vResult == QMessageBox::Yes) {
                Core.mXMLSource = Core.mXMLSourceRevertBackup;
                Core.mXMLSourceHasEditBackup = false;
                loadXML_L3();
                return;
            }
            /*if (vResult == QMessageBox::Abort) {
                Core.mXMLSourceRevertBackup = "";
                Core.mXMLSourceHasEditBackup = false;
                return;
            }*/
        } else {
            Core.error(vErrMsg, 2);
        }
    }
    
    Core.mXMLSourceHasEditBackup = false;

    loadXML_L4();

}


void MainWindow::loadXML_L4() {

    //Reset to standard icon
    setWindowIcon(Core.mDefaultIcon);
    //Reset to standard NES palette
    load_NES_Palette(Core.getConfigStr("NESPaletteFile"));
    
    
    if (Core.mMainXML.hasChildNodes() == false) {return;}

    //Read in two passes:
    //1: Icons
    //2: Everything else, populate tree view
    
    int vPass = 1;
    while (vPass <= 2) {
        //Using a QXmlStreamReader in tandem with QDomDocument+related when parsing.
        //This is in order to get the Start and End character positions of XML Elements.
        QXmlStreamReader vReader;
        vReader.addData(Core.mXMLSource);
        /*if (vReader.hasError() == true) {
        qDebug("Reader reported an error");
        }*/

        XMLReadStatus vStatus;
        vStatus.mPass = vPass;
        vStatus.mItemCount = 0;
        vStatus.mTreeLevel = 0;
        vStatus.mParentTWIRef = 0;
        vStatus.mParentIndex = -1;
        vStatus.mListFloorCounter = 0;
        vStatus.mCurrentSrcLine = 1;
        vStatus.mCharPos = 0;
        vStatus.mValidCharPos = true;
        
        loadXMLRecursive(Core.mMainXML.documentElement(), &vStatus, &vReader);
        
        vPass++;
    }
    
    //ui->wTree->expandAll();
   
}

void MainWindow::loadXMLRecursive(QDomElement aElement, XMLReadStatus *aStatus, QXmlStreamReader *aReader) {

    QTreeWidgetItem *vTreeItem = 0;

    bool wAddToTables = false;
    
    if (aStatus->mPass == 2) {
        if (aStatus->mListFloorCounter > 0) {
            aStatus->mListFloorCounter++;
        }
   
        if (aStatus->mTreeLevel >= 1) {
            wAddToTables = true;
        }
    }
    
    QString vTagText = aElement.nodeName();

    if (aStatus->mPass == 1) {
    if (vTagText.compare("icon", Qt::CaseInsensitive) == 0) {
        QString vKeyName = "";
        QString vFileName = "";
        Core.qElementGetHasAttribute(aElement, "key", &vKeyName);
        Core.qElementGetHasAttribute(aElement, "filename", &vFileName);
        if (vFileName.size() > 0) {
            if (Core.findIncludeFile(&vFileName)) {
                QIcon vQIcon(vFileName);
                tIconTableItem vNewIcon;
                vNewIcon.mIcon = vQIcon;
                vNewIcon.mKey = vKeyName;
                Core.mIconTable.append(vNewIcon);
            }
        }
    }
    }

    if (aStatus->mPass == 2) {
    if ((vTagText.compare("item", Qt::CaseInsensitive) == 0) || 
     (vTagText.compare("bra", Qt::CaseInsensitive) == 0)) {
    
        if (aStatus->mListFloorCounter == 0) {
            wAddToTables = true;
            
            QString vItemName = "Data Item " + QString::number(aStatus->mItemCount+1);
            QString vIconName = "";
            bool vUsingIcon = false;
            
            if (aElement.hasAttributes() == true) {
                Core.qElementGetHasAttribute(aElement, "name", &vItemName);
                vUsingIcon = Core.qElementGetHasAttribute(aElement, "icon", &vIconName);
            }
            
            //Use a table to connect Tree widget items to the DRD Item Element/QDomElement.
            int RefIndex = Core.mItemElmTable.count();

            if (aStatus->mParentTWIRef == 0) {
                //Add to the root of the tree
                vTreeItem = new QTreeWidgetItem(ui->wTree);
            } else {
                if (aStatus->mParentTWIRef) {
                    //Add to current parent
                    vTreeItem = new QTreeWidgetItem(aStatus->mParentTWIRef);
                }
            }
            if (vTreeItem) {
                vTreeItem->setText(0, vItemName);
                vTreeItem->setData(0, eElmRefRole, RefIndex);
                vTreeItem->setData(0, eWindowRole, 0);
                if (vUsingIcon == true) {
                    for (int vIx = 0; vIx < Core.mIconTable.size(); vIx++) {
                        if (vIconName.compare(Core.mIconTable[vIx].mKey, Qt::CaseInsensitive) == 0) {
                            QIcon vIconRef = Core.mIconTable[vIx].mIcon;
                            vTreeItem->setIcon(0, vIconRef);
                        }
                    }
                }
            }
            
        } else {
            wAddToTables = true;
            Core.mListElmIndexTable.append(Core.mItemElmTable.count());
        }
        
        aStatus->mItemCount++;
    } else if (vTagText.compare("list", Qt::CaseInsensitive) == 0) {
        //Set list mode and keep track of floor levels.
        aStatus->mListFloorCounter = 1;
    } else if (vTagText.compare("common", Qt::CaseInsensitive) == 0) {
        wAddToTables = true;
        Core.mCommonElmIndexTable.append(Core.mItemElmTable.count());
    } else if (vTagText.compare("nespal", Qt::CaseInsensitive) == 0) {
        QString vNESPalFile;
        if (Core.qElementGetHasAttribute(aElement, "filename", &vNESPalFile)) {
            if (Core.findIncludeFile(&vNESPalFile)) {
                load_NES_Palette(vNESPalFile);
            }
        }
    } else if (vTagText.compare("info", Qt::CaseInsensitive) == 0) {
        QString vIntSizeAttr;
        if (Core.qElementGetHasAttribute(aElement, "intsize", &vIntSizeAttr)) {
            Core.mDRD_intSize = vIntSizeAttr.toInt();
        }
        QString vIconKey;
        if (Core.qElementGetHasAttribute(aElement, "headicon", &vIconKey)) {
            for (int vIx = 0; vIx < Core.mIconTable.size(); vIx++) {
                if (vIconKey.compare(Core.mIconTable[vIx].mKey, Qt::CaseInsensitive) == 0) {
                    QIcon vIconRef = Core.mIconTable[vIx].mIcon;
                    setWindowIcon(vIconRef);
                }
            }
        }
    }
    } //aStatus->mPass == 2

    loadXMLRecursive_findReaderToken(QXmlStreamReader::StartElement, aStatus, aReader);
    
    int vTableIndex = -1;
    if (wAddToTables == true) {
        tItemElmType vNewItemElm;
        vNewItemElm.mElmRef = aElement;
        vNewItemElm.mItemViewRef = 0;
        vNewItemElm.mArrayIndex = 0;
        vNewItemElm.mArrayByteSz = 1;
        vNewItemElm.mBigEndianByteSz = 0;
        vNewItemElm.mParentIndex = aStatus->mParentIndex;
        vNewItemElm.mHasCharPos = true;
        
        if (aStatus->mValidCharPos == true) {
            bool vValid = true;
            int vCharStart2 = 0;
            int vCharStart = aStatus->mCharPos;
            if (vCharStart < Core.mXMLSource.size()) {
            
                //Find start of next line
                while ((Core.mXMLSource[vCharStart] == 0x20) ||
                        (Core.mXMLSource[vCharStart] == 0xD) ||
                        (Core.mXMLSource[vCharStart] == 0xA)) {

                        vCharStart++;
                        if (vCharStart >= Core.mXMLSource.size()) {vValid = false; break;}
                }
                
            } else {
                vValid = false;
            }
            
            if (vValid == true) {
                //Find start of element text
                vCharStart2 = vCharStart;
                if (vCharStart2 < Core.mXMLSource.size()) {
                    while ((Core.mXMLSource[vCharStart2] == 0x9) ||
                         (Core.mXMLSource[vCharStart2] == 0x20)) 
                     {
                       vCharStart2++;
                       if (vCharStart2 >= Core.mXMLSource.size()) {vValid = false; break;}
                    }
                } else {
                    vValid = false;
                }
            }
    
            if (vValid == true) {
                //If the Element has children, make the tab and spacing preceeding it part of the text.
                //Otherwise, omit it.
                if (aElement.firstChildElement().isNull() == true) {
                    vNewItemElm.mCharStart = vCharStart2;
                } else {
                    vNewItemElm.mCharStart = vCharStart;
                }
                //mTrueCharStart always has it omitted.
                vNewItemElm.mTrueCharStart = vCharStart2;
                
            } else {
                vNewItemElm.mHasCharPos = false;
                aStatus->mValidCharPos = false;
            }
        } else {
            vNewItemElm.mHasCharPos = false;
            aStatus->mValidCharPos = false;
        }

        vTableIndex = Core.mItemElmTable.size();
        Core.mItemElmTable.append(vNewItemElm);
        if (aStatus->mParentIndex >= 0) {
            Core.mItemElmTable[aStatus->mParentIndex].mChildIndexes.append(vTableIndex);
        }
    }
    
    if (aStatus->mValidCharPos == true) {
        aStatus->mCharPos = aReader->characterOffset();
    } else {
        aStatus->mCharPos = 0; 
    }

    QDomElement vChildRef;
    if (aElement.firstChildElement().isNull() == false) {
        vChildRef = aElement.firstChildElement();

        aStatus->mTreeLevel++;
        QTreeWidgetItem *mBackupParentTWI = aStatus->mParentTWIRef;
        aStatus->mParentTWIRef = vTreeItem;
        int vBackupParentIndex = aStatus->mParentIndex;
        aStatus->mParentIndex = vTableIndex;
        
        int vSafeCount = 0;
        while ((vChildRef.isNull() == false) && (vSafeCount < 10000)) {
            
            loadXMLRecursive(vChildRef, aStatus, aReader);

            vChildRef = vChildRef.nextSiblingElement();
            vSafeCount++;
        }
        aStatus->mTreeLevel--;
        aStatus->mParentTWIRef = mBackupParentTWI;
        aStatus->mParentIndex = vBackupParentIndex;

    }

    loadXMLRecursive_findReaderToken(QXmlStreamReader::EndElement, aStatus, aReader);

    if (aStatus->mValidCharPos == true) {
        aStatus->mCharPos = aReader->characterOffset();

        if (wAddToTables == true) {
            Core.mItemElmTable[vTableIndex].mCharEnd = aStatus->mCharPos-1; 
        }
    } else {
        if (wAddToTables == true) {
            Core.mItemElmTable[vTableIndex].mHasCharPos = false;
        }
    }
    
    if (aStatus->mPass == 2) {
        if (aStatus->mListFloorCounter > 0) {
            aStatus->mListFloorCounter--;
        }
    }
}

void MainWindow::loadXMLRecursive_findReaderToken(int aToken, XMLReadStatus *aStatus, QXmlStreamReader *aReader) {
    if (aStatus->mValidCharPos == true) {
        int vToken = -1;
        int vSafeCount = 0;
        while (vToken != aToken) {
            vToken = aReader->readNext();
            vSafeCount++;
            if (aReader->hasError() == true) {
                //Errors should have been detected in loadXML_L3, so this is not supposed to happen.
                
                /*QString vErrorString;
                vErrorString = "QXmlStreamReader reported error at Line ";
                vErrorString += QString::number(aReader->lineNumber());
                vErrorString += ", Collumn " + QString::number(aReader->columnNumber());
                vErrorString += ":\n" + aReader->errorString();
                Core.error(vErrorString, 2);
                aStatus->mValidCharPos = false;*/
                break;
            }
            if ((aReader->atEnd() == true) || (vToken == QXmlStreamReader::EndDocument) || (vSafeCount >= 1000)) {
                QString vErrorString;
                vErrorString = "QXmlStreamReader: Unexpected document end.";
                Core.error(vErrorString, 2);
                aStatus->mValidCharPos = false;
                break;
            }
        }
    }
}

void MainWindow::themeChange() {
    Core.mCustomizeId.clear();
    Core.mCustomizeString.clear();
    
    if (Core.getConfigStr("theme").compare("icedragon", Qt::CaseInsensitive) == 0) {
        Core.mCustomizeId.append("window.stylesheet"); Core.mCustomizeString.append("color: #D0FFFF; background: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, stop:0 rgba(40, 140, 170, 255), stop:1 rgba(130, 170, 200, 255))");
        Core.mCustomizeId.append("grid.color"); Core.mCustomizeString.append("205060");    
        Core.mCustomizeId.append("grid.selcolor"); Core.mCustomizeString.append("70F0FF");
        Core.mCustomizeId.append("color1"); Core.mCustomizeString.append("40DFFF");
        Core.mCustomizeId.append("color2"); Core.mCustomizeString.append("FFFF40");
        Core.mCustomizeId.append("bgcolor"); Core.mCustomizeString.append("003040");
        Core.mCustomizeId.append("edit.stylesheet"); Core.mCustomizeString.append("color: #F0F050; background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, stop:0 rgba(0, 80, 90, 255), stop:1 rgba(0, 150, 160, 255))");
        ui->actionThemeNormal->setChecked(false);
        ui->actionThemeIceDragon->setChecked(true);
    } else {
        ui->actionThemeNormal->setChecked(true);
        ui->actionThemeIceDragon->setChecked(false);
    }

    //Theme: Albino WIP
 /*   Core.mCustomizeId.append("window.stylesheet"); Core.mCustomizeString.append("color: #E05050; background: qlineargradient(spread:reflect, x1:0, x2:1, x3:0, y1:0, y2:1, stop:0 rgba(250, 250, 250, 255), stop:1 rgba(230, 230, 230, 255))");
    Core.mCustomizeId.append("grid.color"); Core.mCustomizeString.append("205060");    
    Core.mCustomizeId.append("grid.selcolor"); Core.mCustomizeString.append("70F0FF");
    Core.mCustomizeId.append("color1"); Core.mCustomizeString.append("40DFFF");
    Core.mCustomizeId.append("color2"); Core.mCustomizeString.append("FFFF40");
    Core.mCustomizeId.append("bgcolor"); Core.mCustomizeString.append("003040");
    Core.mCustomizeId.append("edit.stylesheet"); Core.mCustomizeString.append("font: bold; color: #701000; background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, stop:0 rgba(250, 200, 200, 255), stop:1 rgba(220, 120, 120, 255))");*/


    //Theme: Gothic WIP
/*    Core.mCustomizeId.append("window.stylesheet"); Core.mCustomizeString.append("color: #F8F8F8; background: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, stop:0 rgba(120, 10, 10, 255), stop:1 rgba(220, 40, 40, 255))");
    Core.mCustomizeId.append("grid.color"); Core.mCustomizeString.append("200000");    
    Core.mCustomizeId.append("grid.selcolor"); Core.mCustomizeString.append("FF6060");
    Core.mCustomizeId.append("color1"); Core.mCustomizeString.append("40DFFF");
    Core.mCustomizeId.append("color2"); Core.mCustomizeString.append("FFFF40");
    Core.mCustomizeId.append("bgcolor"); Core.mCustomizeString.append("003040");
    Core.mCustomizeId.append("edit.stylesheet"); Core.mCustomizeString.append("font: \"Cambria\"; color: #E83030; background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, stop:0 rgba(0, 0, 0, 255), stop:1 rgba(60, 30, 30, 255))");
*/


    int vStyleIx = Core.mCustomizeId.indexOf("window.stylesheet");
    if (vStyleIx >= 0) {
       ui->centralWidget->setStyleSheet(Core.mCustomizeString[vStyleIx]);
    } else {
       ui->centralWidget->setStyleSheet("");
    }
    vStyleIx = Core.mCustomizeId.indexOf("edit.stylesheet");
    if (vStyleIx >= 0) {
       ui->wTree->setStyleSheet(Core.mCustomizeString[vStyleIx]);
       ui->wXMLEdit->setStyleSheet(Core.mCustomizeString[vStyleIx]);
    } else {
       ui->wTree->setStyleSheet("");
       ui->wXMLEdit->setStyleSheet("");
    }
}

void MainWindow::on_wTree_currentItemChanged(QTreeWidgetItem *current, QTreeWidgetItem *previous)
{

}

void MainWindow::on_wTree_itemClicked(QTreeWidgetItem *item, int column)
{
   
    int vRefIndex = 0;
    vRefIndex = item->data(0, eElmRefRole).toInt();
    ItemView *vOpenIW = Core.mItemElmTable[vRefIndex].mItemViewRef;
    
    //If a window for this item is already open, set focus to it.
    if (vOpenIW) {
        //vOpenIW->setWindowState(Qt::WindowActive);
        vOpenIW->setFocus();
      //  vOpenIW.refresh();
        return;
    }
    
    ui->mdiArea->closeAllSubWindows();
    
    Core.mLowLevelErrorFlag = false;
   
    ItemView *theItemView = new ItemView;
    

    //theItemView->mMainWnd = this;
    theItemView->mTreeItemRef = item;
     
    theItemView->mElementRef = vRefIndex;

    theItemView->setMinimumSize(640, 600);

   
    ui->mdiArea->addSubWindow(theItemView);
    //item->setData(0, eWindowRole, theItemView);
    Core.mItemElmTable[vRefIndex].mItemViewRef = theItemView;
   

    theItemView->setWindowState(Qt::WindowMaximized|Qt::WindowActive);
    theItemView->show();
 
    theItemView->updateGeometry();
    theItemView->update();
   
    theItemView->setMinimumSize(0, 0);

    QString vItemName = item->text(0);
    
    theItemView->setWindowTitle(vItemName);

    if (Core.mItemElmTable[vRefIndex].mHasCharPos == true) {
        QString vSourceText;
        int vA = Core.mItemElmTable[vRefIndex].mCharStart;
        int vB = Core.mItemElmTable[vRefIndex].mCharEnd+1;
        vSourceText = Core.mXMLSource.mid(vA, vB-vA);
        ui->wXMLEdit->setPlainText(vSourceText);
        ui->wUpdate->setEnabled(true);
        ui->wXMLEdit->setEnabled(true);
    } else {
        disableDirectEdit();
        ui->wXMLEdit->setPlainText("(The item cannot be edited due to problems with the source XML.)");
    }
    
    Core.mXMLEditIndex = vRefIndex;
 
    theItemView->initTypeScript();

}



void MainWindow::on_actionOpenXML_triggered()
{
    selectXMLfile();
}

void MainWindow::on_actionReloadXML_triggered()
{
    if (Core.mXMLFileOpened == true) {
        loadXMLFile(Core.mXMLFileName);
    }
}

void MainWindow::on_actionSaveXML_triggered()
{
    if (Core.mXMLFileOpened == true) {
        Core.saveXML();
    }
}

void MainWindow::on_actionNewXML_triggered()
{
    QString vFName = QFileDialog::getSaveFileName(this, "New XML file", QString(), "XML document (*.xml)");
    if (vFName.size() > 0) {
        unloadXML();
        
        Core.mXMLFileName = vFName;
        Core.mXMLSource = "<drd>\r\n</drd>";
        
        Core.saveXML();
        
        loadXML_L2(Core.mXMLFileName);
    }        
}

void MainWindow::on_actionOpenBinary_triggered()
{
    selectBinFile(false);
}

void MainWindow::on_actionOpenBinBufMode_triggered()
{
    selectBinFile(true);
}

void MainWindow::on_actionSaveBinary_triggered()
{
    saveBinFile(Core.mBinFileName);
}

void MainWindow::on_actionExit_triggered()
{
    close();
}

void MainWindow::on_actionInsertItem_triggered()
{
    bool vPlaceAtSelected = true;
    if (ui->wTree->topLevelItemCount() < 1) {vPlaceAtSelected = false;}
    
    QTreeWidgetItem *qWi;
    qWi = ui->wTree->currentItem();
    
    if (qWi == 0) {vPlaceAtSelected = false;}
    
    QString vItemString = "<item ptr=\"0\" type=\"BLANK\"/>";
    QString vInsertStr;
    int vCharStart = 0;
    int vTabCount = 0;
    
    if (vPlaceAtSelected == false) {
        //No items in the XML or none selected.
        //Assume that there's at least a base element,
        //then add the new item as a child element to that.
        //If there isn't a base element, return.
        
        QXmlStreamReader vReader;
        vReader.addData(Core.mXMLSource);
        
        //Todo: Join together with loadXMLRecursive_findReaderToken.
        int vToken = -1;
        int vSafeCount = 0;
        while (vToken != QXmlStreamReader::StartElement) {
            vToken = vReader.readNext();
            vSafeCount++;
            if (vReader.hasError() == true) {
             /*   QString vErrorString;
                vErrorString = "QXmlStreamReader reported error at Line " ;
                vErrorString += QString::number(vReader.lineNumber());
                vErrorString += ", Collumn " + QString::number(vReader.columnNumber());
                vErrorString += ":\n" + vReader.errorString();
                Core.error(vErrorString, 2);*/
                break;
            }
            if ((vReader.atEnd() == true) || (vToken == QXmlStreamReader::EndDocument) || (vSafeCount >= 1000)) {
                QString vErrorString;
                vErrorString = "QXmlStreamReader: Unexpected document end.";
                Core.error(vErrorString, 2);
                break;
            }
        }

        if (vToken == QXmlStreamReader::StartElement) {
            vCharStart = vReader.characterOffset();
            
            //Todo: Safeguards
            while ((Core.mXMLSource[vCharStart] == 0x20) ||
                (Core.mXMLSource[vCharStart] == 0xD) ||
                (Core.mXMLSource[vCharStart] == 0xA)) {
            
                vCharStart++;
            }
            
            vTabCount = 1;
            vInsertStr = QString(vTabCount, 0x9) + vItemString + "\r\n";
        } else {
            Core.error("Couldn't insert, failed to find base element.", 2);
            return;
        }
    } else {

        int vRefIndex = qWi->data(0, eElmRefRole).toInt();
        
        if (Core.mItemElmTable[vRefIndex].mHasCharPos == false) {
            Core.error("Cannot insert because of problems when parsing the XML.", 2);
            return;
        }
        
        int vCharStart2 = Core.mItemElmTable[vRefIndex].mTrueCharStart;
        vCharStart = Core.mItemElmTable[vRefIndex].mCharEnd+1;

        vTabCount = calculateTabOrder(vCharStart2-1);

        vInsertStr = "\r\n" + QString(vTabCount, 0x9) + vItemString;
        
        
        //Code for Inserting *before* current Item. To be added as an option later.
        
            /*vCharStart = Core.mItemElmTable[vRefIndex].mTrueCharStart;
    
            vTabCount = calculateTabOrder(vCharStart-1);
    
            vInsertStr = vItemString + "\r\n" + QString(vTabCount, 0x9);*/
    }
    
    unloadXML();
    
    Core.mXMLSource.insert(vCharStart, vInsertStr);
    
    loadXML_L3();
}

void MainWindow::on_actionInsertChild_triggered()
{
    if (ui->wTree->topLevelItemCount() < 1) {return;}
    
    QTreeWidgetItem *qWi;
    qWi = ui->wTree->currentItem();
    
    if (qWi == 0) {return;}
    
    int vRefIndex = qWi->data(0, eElmRefRole).toInt();

    if (Core.mItemElmTable[vRefIndex].mHasCharPos == false) {
        Core.error("Cannot insert because of problems when parsing the XML.", 2);
        return;
    }
    QDomElement vChild = Core.mItemElmTable[vRefIndex].mElmRef.firstChildElement();
    int vStart = Core.mItemElmTable[vRefIndex].mCharStart;
    int vEnd = Core.mItemElmTable[vRefIndex].mCharEnd;

    QString vItemString = "<item ptr=\"0\" type=\"BLANK\"/>";
    int vTabCount = 0;

    if (vChild.isNull() == true) {

        //Target element doesn't already have children.
        unloadXML();
        vTabCount = calculateTabOrder(vStart-1);
        
        int vType = 0;
        int vTypeACloser = Core.mXMLSource.indexOf("/>", vStart);
        
        int vTypeBRight1 =  Core.mXMLSource.indexOf('>', vStart);
        int vTypeBLeft1 =  Core.mXMLSource.lastIndexOf("</", vEnd);
        int vTypeBRight2 =  Core.mXMLSource.lastIndexOf('>', vEnd);
        
        if ((vTypeBRight1 >= vStart) && (vTypeBRight1 <= vEnd) && \
            (vTypeBLeft1 >= vStart) && (vTypeBLeft1 <= vEnd) && \
            (vTypeBRight2 >= vStart) && (vTypeBRight2 <= vEnd) && \
            (vTypeBRight1 < vTypeBLeft1) && (vTypeBLeft1 < vTypeBRight2)) {

                vType = 2;
                
        } else if ((vTypeACloser >= vStart) && (vTypeACloser <= vEnd)) {
        
            vType = 1;
        }

        if (vType == 1) {
            //Self-closing.
            
            QString vInsertStr = ">\r\n"+QString(vTabCount+1, 0x9)+ \
                vItemString+"\r\n"+QString(vTabCount, 0x9)+"</item>";
            Core.mXMLSource.replace(vTypeACloser, 2, vInsertStr);
        }
        
        if (vType == 2) {
            //Opening and closing tags in spite of no children (usually when text is present)
            QString vInsertStr = "\r\n" + QString(vTabCount+1, 0x9) + \
                vItemString;
            Core.mXMLSource.insert(vTypeBRight1+1, vInsertStr);
        }
        
        loadXML_L3();
    } else {
        //Target element already has children.
        
        //Reverse search in the Item table to find the final child of the selected item.
        //(It's the last entry whose mParentIndex equals vRefIndex)
        int vChildIndex = Core.mItemElmTable.size()-1;
        while ((vChildIndex >= 0) && (Core.mItemElmTable[vChildIndex].mParentIndex != vRefIndex)) {
            vChildIndex--;
        }
        if (vChildIndex >= 0) { //Just to be safe, -1 should not be possible.
        
            if (Core.mItemElmTable[vChildIndex].mHasCharPos == false) {
                Core.error("Cannot insert because of problems when parsing the XML.", 2);
                return;
            }
            int vCharStart = Core.mItemElmTable[vChildIndex].mTrueCharStart;
            int vCharEnd = Core.mItemElmTable[vChildIndex].mCharEnd;
            
            vTabCount = calculateTabOrder(vCharStart-1);
    
            QString vInsertStr = "\r\n" + QString(vTabCount, 0x9) + vItemString;
            
            unloadXML();
            
            Core.mXMLSource.insert(vCharEnd+1, vInsertStr);
            
            loadXML_L3();
        }
    }
    
}

int MainWindow::calculateTabOrder(int aStart) {
    bool vFlag = true;
    int vTabCount = 0;
    int vCharStart2 = aStart;
    while ((vCharStart2 >= 0) && (vCharStart2 < Core.mXMLSource.size()) && (vFlag == true)) {
        if (Core.mXMLSource[vCharStart2] == 0x9) {
            vTabCount++;
            vCharStart2--;
        } else {
            vFlag = false;
        }
    }
    return vTabCount;
}

void MainWindow::on_actionDeleteItem_triggered()
{
    if (ui->wTree->topLevelItemCount() < 1) {return;}
    
    QTreeWidgetItem *qWi;
    qWi = ui->wTree->currentItem();
    
    if (qWi == 0) {return;}

    int vRefIndex = qWi->data(0, eElmRefRole).toInt();
    if (Core.mItemElmTable[vRefIndex].mHasCharPos == false) {
        Core.error("Cannot delete because of problems when parsing the XML.", 2);
        return;
    }
    
    int vCharStart = Core.mItemElmTable[vRefIndex].mCharStart;
    int vCharEnd = Core.mItemElmTable[vRefIndex].mCharEnd+1;

    int vParentIndex = Core.mItemElmTable[vRefIndex].mParentIndex;
    bool vMakeParentSelfClosing = false;
    if (vParentIndex >= 0) {
        QDomElement vParentElm = Core.mItemElmTable[vParentIndex].mElmRef;

        vMakeParentSelfClosing = vParentElm.firstChildElement().nextSibling().isNull() && \
            Core.mItemElmTable[vParentIndex].mHasCharPos;
        //Don't make it self-closing if it has text (don't delete text)
        QDomNodeList vDNL = vParentElm.childNodes();
        for (int vCount = 0; vCount < vDNL.count(); vCount++) {
            if (vDNL.item(vCount).isText() == true) {
                vMakeParentSelfClosing = false;
            }
        }
    }

    unloadXML();
    
    //Remove all characters related to the element + child elements.
    Core.mXMLSource.remove(vCharStart, vCharEnd-vCharStart);
    
    //Clean up: Remove any /r and /n that came after the element
    bool vFlag = true;
    while ((vCharStart < Core.mXMLSource.size()) && (vFlag == true)) {
        if ((Core.mXMLSource[vCharStart] == '\r') || (Core.mXMLSource[vCharStart] == '\n')) {
            Core.mXMLSource.remove(vCharStart, 1);
        } else {
            vFlag = false;
        }
    }
    //Clean up: Remove any Tab (0xA) that preceeded the element
    vFlag = true;
    vCharStart--;
    while ((vCharStart >= 0) && (vCharStart < Core.mXMLSource.size()) && (vFlag == true)) {
        if (Core.mXMLSource[vCharStart] == 0x9) {
            Core.mXMLSource.remove(vCharStart, 1);
            vCharStart--;
        } else {
            vFlag = false;
        }
    }

    //Clean up: If this was the last (or only) child item, make Parent Item self-closing. (in most cases)
    if ((vMakeParentSelfClosing == true) && (vCharStart >= 0) && (vCharStart < Core.mXMLSource.size())) {
        int vParentOpenEnd = Core.mXMLSource.lastIndexOf('>', vCharStart);
        int vParentCloseStart = Core.mXMLSource.indexOf("</", vCharStart);
        int vParentCloseEnd = -1;
        if (vParentCloseStart >= 0) {
            vParentCloseEnd = Core.mXMLSource.indexOf('>', vParentCloseStart+2)+1;
        }
        if ((vParentOpenEnd >= 0) && (vParentCloseStart >= 0) && (vParentCloseEnd >= 0)) {
            Core.mXMLSource.remove(vParentOpenEnd+1, vParentCloseEnd-(vParentOpenEnd+1));
            Core.mXMLSource.replace(vParentOpenEnd, 1, "/>");
        }
    }
   
    loadXML_L3();
}

void MainWindow::on_actionClearXML_triggered()
{

    int vResult = QMessageBox::warning(this, Core.getConfigStr("programTitle"), \
        "This will remove ALL elements in the XML and leave only a base Element. \n\
Do you wish to continue?", QMessageBox::Yes|QMessageBox::No, QMessageBox::No);

    if (vResult == QMessageBox::Yes) {
        unloadXML();
        Core.mXMLSource = "<drd>\r\n</drd>";
        loadXML_L3();
    }
}

void MainWindow::on_actionThemeNormal_triggered()
{
    
    Core.mConfig.setProperty("theme", "normal");

    themeChange();
    unloadXML();
    loadXML_L3();
}


void MainWindow::on_actionThemeIceDragon_triggered()
{
    ui->actionThemeNormal->setChecked(false);
    ui->actionThemeIceDragon->setChecked(true);

    Core.mConfig.setProperty("theme", "icedragon");

    themeChange();
    unloadXML();
    loadXML_L3();
}

void MainWindow::on_actionViewWBufferStats_triggered()
{    
    QString vLog;
    if (Core.mBinFileOpened == false) {
        vLog += "No file is open.";
    } else {
        if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
            if (Core.mBufferBlockLocations.count() > 0) {
                for (int vCount = 0; vCount < Core.mBufferBlockLocations.count(); vCount++) {
                    quint64 vPtr = quint64(Core.mBufferBlockLocations[vCount]) * quint64(Core.mBufferBlockSize);
                    vLog += "Segment @ 0x" + QString::number(vPtr, 16);
                    vLog += " - Size: 0x" + QString::number(Core.mBufferBlockData[vCount].size(), 16);
                    vLog += " bytes.\n";
                }
            } else {
                vLog += "No changes have been made since last load or save.";
            }
        } else {
            vLog += "The binary (" + Core.mBinFileName + ") is not opened in Write Buffer mode.";
        }
    }
        
    QMessageBox::information(this, "Write Buffer segment log", vLog);
}


void MainWindow::on_mdiArea_subWindowActivated(QMdiSubWindow *arg1)
{
   /* ItemView *theItemView;
    theItemView = (ItemView*)arg1;
    */
}

void MainWindow::on_wUpdate_clicked()
{
    if (Core.mXMLEditIndex < 0) {return;}
    
    //Make a backup
    Core.mXMLSourceRevertBackup = Core.mXMLSource;
    Core.mXMLSourceHasEditBackup = true;
    
    QString vNew = ui->wXMLEdit->toPlainText();
    int vFirstChar = Core.mItemElmTable[Core.mXMLEditIndex].mCharStart;
    int vLastChar = Core.mItemElmTable[Core.mXMLEditIndex].mCharEnd+1;
    Core.mXMLSource = Core.mXMLSource.replace(vFirstChar, vLastChar-vFirstChar, vNew);
    unloadXML();
    loadXML_L3();
    
}

void QSliderSC::setValue(int value) {
    programChanged = true;
    QAbstractSlider::setValue(value);
    programChanged = false;
}
