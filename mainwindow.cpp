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


tCore Core;

void QSliderSC::setValue(int value) {
    programChanged = true;
    QAbstractSlider::setValue(value);
    programChanged = false;
}

static QScriptValue scriptF_hasText(QScriptContext *aContext, QScriptEngine *aEngine) {
    QDomElement vElement = Core.getEngineElmRef(aEngine).toElement();
    QDomNodeList vDNL = vElement.childNodes();
    for (int vCount = 0; vCount < vDNL.count(); vCount++) {
        if (vDNL.item(vCount).isText() == true) {
            return true;
        }
    }
    /*QString text = Core.getEngineElmRef(aEngine).toElement().text();
    
    if (text.length() > 0) {
        return true;
    } else {
        return false;
    }*/
    
    return false;
}

static QScriptValue scriptF_getText(QScriptContext *aContext, QScriptEngine *aEngine) {
    QString text = "";
    QDomElement vElement = Core.getEngineElmRef(aEngine).toElement();
    QDomNodeList vDNL = vElement.childNodes();
    for (int vCount = 0; vCount < vDNL.count(); vCount++) {
        if (vDNL.item(vCount).isText() == true) {
            text += vDNL.item(vCount).toText().data();
        }
    }
    
    //QScriptValue vResult; 
    //QString text = Core.getEngineElmRef(aEngine).toElement().text();
    return(text);
}

static QScriptValue scriptF_hasAttr(QScriptContext *aContext, QScriptEngine *aEngine) {

    if (aContext->argumentCount() > 0) {
        QString vAttrName = aContext->argument(0).toString();
        
        if (Core.itemHasAttr(vAttrName, Core.getEngineElmRef(aEngine))) {
            return (true);
        } else {
            return (false);
        }
    }
    
    return (false);
}


static QScriptValue scriptF_getByte(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    if (aContext->argumentCount() > 0) {
        quint64 vArgPointer = aContext->argument(0).toVariant().toULongLong();
        int vIndex = Core.getEngineElmIndex(aEngine);
        
        quint32 vV = Core.getItemByte(vArgPointer, Core.mItemElmTable[vIndex].mElmRef, vIndex);
        vReturnVal = QScriptValue(int(vV));
    
    }
    return vReturnVal;
}

static QScriptValue scriptF_setByte(QScriptContext *aContext, QScriptEngine *aEngine) {
    
    QScriptValue vReturnVal;
    if (aContext->argumentCount() > 1) {
        quint64 vArgPointer = aContext->argument(0).toVariant().toULongLong();
        quint32 vValue = aContext->argument(1).toUInt32();
        int vIndex = Core.getEngineElmIndex(aEngine);
        
        Core.setItemByte(vArgPointer, vValue, Core.mItemElmTable[vIndex].mElmRef, vIndex);
    
    }
    return vReturnVal;
}


static QScriptValue scriptF_getAttr(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vDefaultReturnVal;
    
    if (aContext->argumentCount() > 0) {
        QString vAttrName = aContext->argument(0).toString();
        
        QString vAttr = Core.getItemAttr(vAttrName, Core.getEngineElmRef(aEngine));
        return vAttr;
    }
    
    return vDefaultReturnVal;
}

static QScriptValue scriptF_getHexValueAttr(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    QScriptValue vHexV = scriptF_getAttr(aContext, aEngine);
    
    int vRetVInt = vHexV.toString().toInt(0, 16);
    vReturnVal = vRetVInt;
    return vReturnVal;
}


static QScriptValue scriptF_getFlag(QScriptContext *aContext, QScriptEngine *aEngine) {
   QScriptValue vDefaultReturnVal = false;
    
    if (aContext->argumentCount() > 0) {
        QString vFlagName = aContext->argument(0).toString();
        
        bool vFlagBool = Core.getItemFlag(vFlagName, Core.getEngineElmRef(aEngine));
        
        return vFlagBool;
    }
    return vDefaultReturnVal;
}

static QScriptValue scriptF_setArrayIndex(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    if (aContext->argumentCount() > 0) {
        int vArrIndex = aContext->argument(0).toInt32();
        int vElmIndex = Core.getEngineElmIndex(aEngine);
        Core.mItemElmTable[vElmIndex].mArrayIndex = vArrIndex;
    }
    return vReturnVal;
}

static QScriptValue scriptF_getArrayIndex(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    int vElmIndex = Core.getEngineElmIndex(aEngine);
    vReturnVal = Core.mItemElmTable[vElmIndex].mArrayIndex;
    return vReturnVal;
}


static QScriptValue scriptF_setArrayByteSize(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    if (aContext->argumentCount() > 0) {
        int vByteSize = aContext->argument(0).toInt32();
        int vElmIndex = Core.getEngineElmIndex(aEngine);
        Core.mItemElmTable[vElmIndex].mArrayByteSz = vByteSize;
    }
    return vReturnVal;
}


static QScriptValue scriptF_getElementIndex(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    QScriptValue vGlob = aEngine->globalObject();
    QScriptValue vCore = vGlob.property("Core");
    int vIndex = vCore.property("elmRefIndex").toInteger();
    vReturnVal = vIndex;
    return vReturnVal;
}

static QScriptValue scriptF_customize(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    if (aContext->argumentCount() > 1) {
        QString vAttrName = aContext->argument(0).toString();
        QScriptValue vValue = aContext->argument(1);

        if (Core.itemHasAttr(vAttrName, Core.getEngineElmRef(aEngine))) {
            vReturnVal = Core.getItemAttr(vAttrName, Core.getEngineElmRef(aEngine));
        } else {
            vReturnVal = vValue;
        }
    }
    
    return (vReturnVal);
}

static QScriptValue scriptF_getList(QScriptContext *aContext, QScriptEngine *aEngine) {
    QScriptValue vReturnVal;
    
    if (aContext->argumentCount() > 0) {
        QString vListKey = aContext->argument(0).toString();
        for (int vIndex = 0; vIndex < Core.mListElmIndexTable.count(); vIndex++) {
            QDomElement vElement = Core.mItemElmTable[Core.mListElmIndexTable[vIndex]].mElmRef;
            QString vThisKey = vElement.attribute("key");
            if (vThisKey.compare(vListKey, Qt::CaseInsensitive) == 0) {
                        QString vWholeList = vElement.text();
                        QStringList vListList;
                        bool vLoopFlag = true;
                        int vCharPos = 0;
                        while (vLoopFlag == true) {
                            int vQuotePos1 = vWholeList.indexOf(QChar(0x22), vCharPos);
                            int vQuotePos2 = vWholeList.indexOf(QChar(0x22), vQuotePos1+1);
                            if ((vQuotePos1 >= 0) && (vQuotePos2 >= 0)) {
                                vListList.append(vWholeList.mid(vQuotePos1+1, vQuotePos2-vQuotePos1-1));
                            } else {
                                vLoopFlag = false;
                            }
                            vCharPos = vQuotePos2+1;
                        }

                
                vReturnVal = qScriptValueFromSequence(aEngine, vListList);
                return vReturnVal;
            }
        }
        QStringList vNoList("(Couldn't find '" + vListKey + "'!)");
        vReturnVal = qScriptValueFromSequence(aEngine, vNoList);
        return vReturnVal;
    }
    
    QStringList vNoList2("");
    vReturnVal = qScriptValueFromSequence(aEngine, vNoList2);
    return vReturnVal;
}

static QScriptValue scriptF_loadTextFile(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal = "";
    if (aContext->argumentCount() > 0) {
        QByteArray vFileData;
        QString vFileName = aContext->argument(0).toString();
        bool vResult1 = Core.findIncludeFile(&vFileName);
        if (vResult1 == true) {
            bool vResult2 = Core.loadFileCommon(vFileName, &vFileData);
            if (vResult2 == true) {
                vReturnVal = QScriptValue(vFileData.data()).toString();
            }
        }
    }
    
    return (vReturnVal);
}


tCore::tCore() {
    mEventForScript = new tEventForScript(0);
    
    mTypeScriptPath = "Script/Type/";
    mDefaultNESPALFile = "fr_nesB.pal";
    
    mDRD_intSize = 16;
    
    mVersionDate = 251111;
    
    mBinFileOpened = false;
    mBinFileName = "";
    mBufferSystem = eBufferSystem_Single; //Overwritten on file open

    mXMLFileOpened = false; 
    mXMLEditIndex = -1;
    
    mLowLevelErrorFlag = false;
    
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
    if (Core.mBufferSystem == eBufferSystem_Single) {
        quint32 vPtr = aPtr;
        if (vPtr < mEditFileFullBuffer.size()) {
        return ((uchar)mEditFileFullBuffer[vPtr]);
        } else {
           Core.error("Read past binary size: 0x" + QString::number(vPtr, 16), 1);
           return 0;
        }
    } else if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        //Read directly from file.
        if (aPtr < mLockedBinQFile.size()) {
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
    if (Core.mBufferSystem == eBufferSystem_Single) {
        quint32 vPtr = aPtr;
        if (vPtr < mEditFileFullBuffer.size()) {
        mEditFileFullBuffer[vPtr] = aValue;
        } else {
          Core.error("Write past binary size: 0x" + QString::number(vPtr, 16), 1);
        }
    }

    if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
    
    /*    quint32 vBlockIndex = 0;
        quint64 vBlock = qFloor(aPtr / Core.mBufferBlockSize);
        quint32 vIndex = 0;
        if ((vIndex = mBufferBlockLocations.indexOf(vBlock)) >= 0) {
            vBlockIndex = vIndex;
        } else {
            QByteArray vBA;
            quint64 vBlockStart = quint64(vBlockIndex) * Core.mBufferBlockSize;
            QFile vFile;
            vFile.setFileName(aFName);
            bool vResult = vFile.open(QIODevice::ReadOnly);
            if (vResult == true) {
                vFile.seek(vBlockStart);
                *aBA = vFile.read(Core.mBufferBlockSize);
                vFile.close();
            } else {
            
            }
        }*/
    
    }
}

quint32 tCore::getItemByte(qint64 aPtr, QDomElement aElmRef, int aElmIndex) {
    qint64 vPtr = calcItemPtr(aPtr, aElmRef, aElmIndex);
    
    return(getFileByte(vPtr));
}

void tCore::setItemByte(qint64 aPtr, quint32 aValue, QDomElement aElmRef, int aElmIndex) {
    qint64 vPtr = calcItemPtr(aPtr, aElmRef, aElmIndex);
    
    setFileByte(vPtr, aValue);
}

void tCore::scriptLoad(QString aFileName, QScriptEngine *aEngine) {
    QFile scriptFile(aFileName);
    if (!scriptFile.open(QIODevice::ReadOnly)) {
        return;
    }
    QTextStream stream(&scriptFile);
    QString contents = stream.readAll();
    scriptFile.close();
    
    QString vIncludeTagStr = "FLEX_INCLUDE";
    int vIncludeTag = contents.indexOf(vIncludeTagStr);
    while (vIncludeTag >= 0) {
        int vCPA = contents.indexOf('"', vIncludeTag) + 1;
        int vCPB = contents.indexOf('"', vCPA);
        QString vFile = contents.mid(vCPA, vCPB - vCPA);
        vFile.prepend(Core.mTypeScriptPath);
        Core.scriptLoad(vFile, aEngine);
        vIncludeTag = contents.indexOf(vIncludeTagStr, vCPB);
    }
    
    aEngine->evaluate(contents, aFileName);
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


/*tEventForScript::tEventForScript(QWidget *parent) {
    QWidget *par = parent;
    QObject::QObject(par);
}*/

void tEventForScript::dispatch(int aEventCode) {
    emit signal(aEventCode);
}

void tCore::scriptEnvSetup(QScriptEngine *aEngine, QWidget *aWindowVar, int aElmRefIndex ) {
    QScriptValue vGlob = aEngine->globalObject();    

    QScriptValue vEvent = aEngine->newQObject(mEventForScript);
    QScriptValue vEventBits = aEngine->newObject();
    vEventBits.setProperty("changeindex", 1); //To be removed, keep for now
    vEventBits.setProperty("changeIndex", 1);
    vEventBits.setProperty("changeMajor", 2);
    vEventBits.setProperty("user", 256);
    vEvent.setProperty("bit", vEventBits);
    vGlob.setProperty("event", vEvent); //To be removed, keep for now
    vGlob.setProperty("Event", vEvent);
    
    vGlob.setProperty("QLabel", aEngine->scriptValueFromQMetaObject<QLabelSC>());
    vGlob.setProperty("QLineEdit", aEngine->scriptValueFromQMetaObject<QLineEditSC>());
    vGlob.setProperty("QPlainTextEdit", aEngine->scriptValueFromQMetaObject<QPlainTextEditSC>());
    vGlob.setProperty("QComboBox", aEngine->scriptValueFromQMetaObject<QComboBoxSC>());
    vGlob.setProperty("QPushButton", aEngine->scriptValueFromQMetaObject<QPushButtonSC>());
    vGlob.setProperty("QFrame", aEngine->scriptValueFromQMetaObject<QFrameSC>());
    vGlob.setProperty("QSlider", aEngine->scriptValueFromQMetaObject<QSliderSC>());
    vGlob.setProperty("QCheckBox", aEngine->scriptValueFromQMetaObject<QCheckBoxSC>());
    vGlob.setProperty("QSpinBox", aEngine->scriptValueFromQMetaObject<QSpinBoxSC>());
    
    vGlob.setProperty("BitmapView", aEngine->scriptValueFromQMetaObject<BitmapView>());

    QScriptValue vCore;
    vGlob.setProperty("Core", aEngine->newObject());
    vCore = vGlob.property("Core");
   
    vCore.setProperty("hasAttr", aEngine->newFunction(&scriptF_hasAttr, 1));
    vCore.setProperty("getAttr", aEngine->newFunction(&scriptF_getAttr, 1));
    vCore.setProperty("getHexValueAttr", aEngine->newFunction(&scriptF_getHexValueAttr, 1));
    vCore.setProperty("getFlag", aEngine->newFunction(&scriptF_getFlag, 1));    
    vCore.setProperty("hasText", aEngine->newFunction(&scriptF_hasText, 0));
    vCore.setProperty("getText", aEngine->newFunction(&scriptF_getText, 0));
    vCore.setProperty("getByte", aEngine->newFunction(&scriptF_getByte, 1));
    vCore.setProperty("setByte", aEngine->newFunction(&scriptF_setByte, 2));
    vCore.setProperty("getElementIndex", aEngine->newFunction(&scriptF_getElementIndex, 0));
    vCore.setProperty("setArrayIndex", aEngine->newFunction(&scriptF_setArrayIndex, 1));
    vCore.setProperty("getArrayIndex", aEngine->newFunction(&scriptF_getArrayIndex, 0));
    vCore.setProperty("setArrayByteSize", aEngine->newFunction(&scriptF_setArrayByteSize, 1));
    vCore.setProperty("customize", aEngine->newFunction(&scriptF_customize, 2));
    vCore.setProperty("getList", aEngine->newFunction(&scriptF_getList, 1));
    vCore.setProperty("loadTextFile", aEngine->newFunction(&scriptF_loadTextFile, 1));
    
    vCore.setProperty("window", aEngine->newQObject(aWindowVar));
    vCore.setProperty("elmRefIndex", aElmRefIndex);
    vCore.setProperty("defaultIntSize", Core.mDRD_intSize);
    vCore.setProperty("versionDate", Core.mVersionDate);
    
    vCore.setProperty("base_y", 12);
    vCore.setProperty("base_x", 15);
    
    QScriptValue vWinpal;
    vCore.setProperty("winpal", aEngine->newObject());
    vWinpal = vCore.property("winpal");
    
    int bgcolor = 0x808080;
    if (aWindowVar) {

        QColor bgcolorqc = aWindowVar->palette().color(QPalette::Active, QPalette::Window);
        bgcolor = (bgcolorqc.blue() * 65536) | (bgcolorqc.green() * 256) | bgcolorqc.red();
    }
    vWinpal.setProperty("bgcolor", bgcolor);
    
    //Convert Core.mNESPal to a QVector<uchar> to be passed to qScriptValueFromSequence..
    //if we pass Core.mNESPal directly it places the values as signed chars.
    {
        QScriptValue vNESPAL;
        QVector<uchar> vTempConvert(Core.mNESPal.size());
        memcpy(vTempConvert.data(), Core.mNESPal.data(), Core.mNESPal.size());
        vNESPAL = qScriptValueFromSequence(aEngine, vTempConvert);
        vCore.setProperty("NESPalette", vNESPAL);
    }
}

int tCore::getCommonElementIndex(QDomElement aElmRef) {
    if (itemHasAttr("common", aElmRef) == true) {
        int vCommonElementNum = Core.mCommonElmIndexTable.count();
        if (vCommonElementNum > 0) {
            
            int vIx = 0;
            while(vIx < vCommonElementNum) {
                int vElmIndex = Core.mCommonElmIndexTable[vIx];
                QString vKey = Core.mItemElmTable[vElmIndex].mElmRef.attributes().namedItem("key").nodeValue();
                if (vKey.compare(getItemAttr("common", aElmRef), Qt::CaseInsensitive) == 0) {
                    return vIx;
                }
                vIx++;
            }
        }
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
        //Search in Common, if provided. Also, if this is a "common", don't continue (prevent infinite recursion).
        if (aElmRef.nodeName().compare("common") != 0) {
            int vIndex = getCommonElementIndex(aElmRef);
            if (vIndex >= 0) {
                int vElmIndex = Core.mCommonElmIndexTable[vIndex];
                return itemHasAttr(aName, Core.mItemElmTable[vElmIndex].mElmRef, false);
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

qint64 tCore::calcItemPtr(qint64 aPtr, QDomElement aElmRef, int aElmIndex) {
//    QDomNamedNodeMap vAttr = aElmRef.attributes();
    qint64 vWorkPtr = aPtr;
    
    // "ptr" is absolute. No deeper search is needed.
    if (itemHasAttr("ptr", aElmRef)) {
        vWorkPtr += getItemAttr("ptr", aElmRef).toULongLong(0, 16);
        goto ptrFinishCalcPhaseA;
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
            vWorkPtr += calcItemPtr(0, vParent.toElement(), vParentIndex);
        }
        }
    }

ptrFinishCalcPhaseA:
    if (aElmIndex >= 0) {
        vWorkPtr += (mItemElmTable[aElmIndex].mArrayIndex*mItemElmTable[aElmIndex].mArrayByteSz);
    }
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
    } else {
        vFI.setFile(*aFName);
        if (vFI.exists()) {
            //Relative to app path.
            return true;
        }
    }
    return false;
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
    QString vTitle = "Flexible Editor (build " + QString::number(Core.mVersionDate) + ")";
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
}

void MainWindow::init() {
  //mXMLmenu.addAction("Insert Item..", this, SLOT(on_insertItem()));
  //mXMLmenu.addAction("Delete Item", this, SLOT(on_deleteItem());
  
    load_NES_Palette(Core.mDefaultNESPALFile);
    
    Core.mDefaultIcon = QIcon("testlogo.png");
    setWindowIcon(Core.mDefaultIcon);
    
    #ifndef QT_DEBUG
    loadXMLFile("demo.xml");
    loadBinFile("demo.bin", eBufferSystem_Single);
    #else
    dev_init_();
    #endif
    
    /*#ifndef QT_DEBUG
        ui->wXMLEdit->hide();
        ui->wUpdate->hide();
        ui->verticalSpacer_2->setGeometry(QRect(0, 0, 0, 0));
    #endif*/
    
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

void MainWindow::selectBinFile() {
  QString vFile;
  vFile = QFileDialog::getOpenFileName(this, "Open data file", QString());
  if (vFile.size() > 0) {
    loadBinFile(vFile, eBufferSystem_Single);
  }
}

void MainWindow::dev_init_() {

   // dev_init_combo_("demo.xml", "demo.bin");
    //Core.mBinFileName = "debug_save.bin";
  //  Core.mXMLFileName = "debug_save.xml";
    
   // dev_init_combo_("C:/romhacking/tools/DRDHack/srfx.xml", "C:/romhacking/tools/DRDHack/stuntracefx.smc");
   // dev_init_combo_("C:/romhacking/tools/DRDHack/bc.xml", "C:/romhacking/tools/DRDHack/bc.nes");
   // dev_init_combo_("C:/work/mm4ex/megaman4.xml", "D:/roms/nes/Mega Man 4 (U).nes");
   // dev_init_combo_("C:/web/geocities/megaman5.xml", "D:/roms/nes/Mega Man 5 (U).nes");
    dev_init_combo_("XML/Magic Sword (SNES).xml", "C:/work/magicsword/ms_clean.sfc");
}

void MainWindow::dev_init_combo_(QString aXML, QString aBIN) {
    loadXMLFile(aXML);
    loadBinFile(aBIN, eBufferSystem_Single);
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

    aMode = eBufferSystem_Single;
    QFileInfo vFI;
    vFI.setFile(aFName);
    quint64 vFileSize = vFI.size();
    if (vFileSize >= 1000000000) {
        int vResult = QMessageBox::question(this, "Flexible Editor", \
        "The file is larger than 1GB. Do you wish to open it in Read Only mode?\n(Loading might fail otherwise)", 
        QMessageBox::Yes|QMessageBox::No, QMessageBox::No);
        if (vResult == QMessageBox::Yes) {
            aMode = eBufferSystem_WriteBuffer;
        }
    }

    ui->mdiArea->closeAllSubWindows();
    if (Core.mEditFileFullBuffer.size() > 0) {
        Core.mEditFileFullBuffer.clear();
    }
    if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        Core.mLockedBinQFile.close();
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
        bool vResult = Core.mLockedBinQFile.open(QIODevice::ReadOnly);
        if (vResult == true) {
            Core.mBinFileOpened = true;
            Core.mBinFileName = aFName;
            Core.mBufferSystem = eBufferSystem_WriteBuffer;
            ui->actionSaveBinary->setEnabled(false);
        } else {
            Core.error("Failed to open: " + aFName + "in Read Only mode.", 2);
        }
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
    } else {
        
    }
}

void MainWindow::load_NES_Palette(QString aFName) {
    Core.loadFileCommon(aFName, &Core.mNESPal);
}


void MainWindow::loadXMLFile(QString aFName) {
    unloadXML();

    QFile vFile;
    vFile.setFileName(aFName);
    vFile.open(QIODevice::ReadOnly);
    Core.mXMLsource = vFile.readAll();
    vFile.close();
    
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
    QString vError;
    int vErrorLine;
    int vErrorCol;
    bool vResult = Core.mMainXML.setContent(Core.mXMLsource, &vError, &vErrorLine, &vErrorCol);

    if (vResult == false) {
        QString vErrMsg;
        vErrMsg = "XML Parse error (Line " + QString::number(vErrorLine) + ", Col " + QString::number(vErrorCol) + "): " + vError; 
        #ifdef QT_DEBUG
            qDebug(vErrMsg.toUtf8());
        #endif
        Core.error(vErrMsg, 2);
    }

    loadXML_L4();

}


void MainWindow::loadXML_L4() {

    //Reset to standard icon
    setWindowIcon(Core.mDefaultIcon);
    //Reset to standard NES palette
    load_NES_Palette(Core.mDefaultNESPALFile);
    
    XMLReadStatus vStatus;
    vStatus.mItemCount = 0;
    vStatus.mTreeLevel = 0;
    vStatus.mParentTWIRef = 0;
    vStatus.mParentIndex = -1;
    vStatus.mListFloorCounter = 0;
    vStatus.mCurrentSrcLine = 1;
    vStatus.mCharPos = 0;
    
    if (Core.mMainXML.hasChildNodes() == false) {return;}

    //Find and load any icons before crawling the XML tree.
    QDomNodeList vIcons = Core.mMainXML.elementsByTagName("icon");
    if (vIcons.length() > 0) {
        for (int vIx = 0; vIx < vIcons.length(); vIx++) {
            QDomElement vElement = vIcons.at(vIx).toElement();
            QString vKeyName = "";
            QString vFileName = "";
            Core.qElementGetHasAttribute(vElement, "key", &vKeyName);
            Core.qElementGetHasAttribute(vElement, "filename", &vFileName);
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
    
    QXmlStreamReader vReader;
    vReader.addData(Core.mXMLsource);
    loadXMLRecursive(Core.mMainXML.documentElement(), &vStatus, &vReader);
    
    ui->wTree->expandAll();
   
}

void MainWindow::loadXMLRecursive(QDomElement aElement, XMLReadStatus *aStatus, QXmlStreamReader *aReader) {

    QTreeWidgetItem *vTreeItem = 0;

    if (aStatus->mListFloorCounter) {
        aStatus->mListFloorCounter++;
    }

    bool wAddToTables = false;
    
    QString vTagText;
    vTagText = aElement.nodeName();
    if ((vTagText.compare("item", Qt::CaseInsensitive) == 0) || 
     (vTagText.compare("bra", Qt::CaseInsensitive) == 0)) {
    
        if (aStatus->mListFloorCounter == 0) {
            QString vItemName = "Data Item " + QString::number(aStatus->mItemCount+1);
            QString vIconName = "";
            bool vUsingIcon = false;
            
            if (aElement.hasAttributes()) {
                Core.qElementGetHasAttribute(aElement, "name", &vItemName);
                vUsingIcon = Core.qElementGetHasAttribute(aElement, "icon", &vIconName);
            }
            
            //Use a table to connect Tree widget items to the DRD Item Element/QDomElement.
            int RefIndex = Core.mItemElmTable.count();
            wAddToTables = true;

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
    
    int vToken = -1;
    while (vToken != QXmlStreamReader::StartElement) {
        vToken = aReader->readNext();
    }
    
    int vTableIndex = -1;
    if (wAddToTables == true) {
        tItemElmType vNewItemElm;
        vNewItemElm.mElmRef = aElement;
        vNewItemElm.mItemViewRef = 0;
        vNewItemElm.mArrayIndex = 0;
        vNewItemElm.mArrayByteSz = 1;
        vNewItemElm.mParentIndex = aStatus->mParentIndex;
        
        int vCharStart = aStatus->mCharPos;//aReader->characterOffset();
        
        while ((Core.mXMLsource[vCharStart] == 0x20) ||
                (Core.mXMLsource[vCharStart] == 0xD) ||
                (Core.mXMLsource[vCharStart] == 0xA)) {
            
                vCharStart++;
            }
        
        int vCharStart2 = vCharStart;
        while ((Core.mXMLsource[vCharStart2] == 0x9) ||
             (Core.mXMLsource[vCharStart2] == 0x20)) 
         {
           vCharStart2++;
        }
        
        vNewItemElm.mCharEnd = vCharStart;
        
        //If the Element has children, make the tab and spacing preceeding it part of the text.
        //Otherwise, omit it.
        if (aElement.firstChildElement().isNull() == true) {
            vNewItemElm.mCharStart = vCharStart2;
        } else {
            vNewItemElm.mCharStart = vCharStart;
        }
        //mTrueCharStart always has it omitted.
        vNewItemElm.mTrueCharStart = vCharStart2;

        //qDebug(QString::number(vNewItemElm.mCharStart, 16).toLatin1());
        
        vTableIndex = Core.mItemElmTable.size();
        Core.mItemElmTable.append(vNewItemElm);
    }
    
    aStatus->mCharPos = aReader->characterOffset();

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

    vToken = -1;
    while (vToken != QXmlStreamReader::EndElement) {
        vToken = aReader->readNext();
    }

    aStatus->mCharPos = aReader->characterOffset();

    if (wAddToTables == true) {
        int vEndChar = aStatus->mCharPos-1;
        Core.mItemElmTable[vTableIndex].mCharEnd = vEndChar; 
    }

    if (aStatus->mListFloorCounter) {
        aStatus->mListFloorCounter--;
    }
}

void MainWindow::saveXML() {
    QFile vFile;
    vFile.setFileName(Core.mXMLFileName);
    vFile.open(QIODevice::WriteOnly);
    vFile.seek(0);
    QByteArray vByteData = Core.mXMLsource.toUtf8();
    vFile.write(vByteData.constData(), vByteData.length());
    vFile.close();
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

    QString vSourceText;
    int vA = Core.mItemElmTable[vRefIndex].mCharStart;
    int vB = Core.mItemElmTable[vRefIndex].mCharEnd+1;
    vSourceText = Core.mXMLsource.mid(vA, vB-vA);
    ui->wXMLEdit->setPlainText(vSourceText);
    Core.mXMLEditIndex = vRefIndex;
 
    theItemView->initTypeScript();

    ui->wUpdate->setEnabled(true);
    ui->wXMLEdit->setEnabled(true);
}


void BitmapView::init (int aWidth, int aHeight) {
    
    resize(aWidth+2, aHeight+2);

    setFrameStyle(0);
    setLineWidth(0);
    setMidLineWidth(0);
    
    setFrameShape(QFrame::NoFrame);
   // this->frameWidth = 0;
    
    mImage = QImage::QImage(aWidth, aHeight, QImage::Format_RGB32);
    mImage.fill(0x0);
    mPixmap.convertFromImage(mImage);
    mScene.clear();
    mScene.addPixmap(mPixmap);
    //QTransform vTransformBasic;
    //setTransform(vTransformBasic, false);
   
    setScene(&mScene);
   // scale(1, 1);
}

void BitmapView::mousePressEvent(QMouseEvent *event) {   
   int x = event->x();
   int y = event->y();
   int button = event->buttons();
   
   emit mousePress(button, y, x);
}

void BitmapView::refresh() {
    mPixmap.convertFromImage(mImage);
    mScene.update();
}

void BitmapView::setPixel(int aY, int aX, int aValue) {
//    Note sure which is faster.
//    mImage.setPixel(aX, aY, aValue);
    quint32 *pixp = (QRgb*) mImage.scanLine(aY);
    pixp += aX;
    *pixp = (QRgb)aValue;
}

void BitmapView::drawLineX(int aY, int aX1, int aX2, int aValue) {
    QRgb vTo = aValue;

    int vLenX = (aX2 - aX1)+1;
    QRgb *pixp = (QRgb*) mImage.scanLine(aY);
    pixp += aX1;
    for (int x = 0; x < vLenX; x++) {
        *pixp++ = vTo;
    }
}

void BitmapView::drawLineY(int aY1, int aY2, int aX, int aValue) {
    QRgb vTo = aValue;
   
    int vLenY = (aY2 - aY1)+1;
    int vLineByteJump = mImage.width();
    QRgb *pixp = (QRgb*) mImage.scanLine(aY1);
    pixp += aX;
    for (int y = 0; y < vLenY; y++) {
        *pixp = vTo;
        pixp += vLineByteJump;
    }
}

void BitmapView::drawBox(int aY1, int aY2, int aX1, int aX2, int aValue) {
    QRgb vTo = aValue;

    int vLenY = (aY2 - aY1)+1;
    int vLenX = (aX2 - aX1)+1;
    int vLineByteJump = mImage.width();
    QRgb *pixp = (QRgb*) mImage.scanLine(aY1);
    pixp += aX1;
    QRgb *firstpixp = pixp;
    for (int x = 0; x < vLenX; x++) {
        *pixp++ = vTo;
    }
    pixp += (vLineByteJump - vLenX);
    for (int y = 1; y < vLenY; y++) {
        memcpy(pixp, firstpixp, (vLenX*4));
        pixp += vLineByteJump;
    }
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
        saveXML();
    }
}

void MainWindow::on_actionNewXML_triggered()
{
    QString vFName = QFileDialog::getSaveFileName(this, "New XML file", QString(), "XML document (*.xml)");
    if (vFName.size() > 0) {
        unloadXML();
        
        Core.mXMLFileName = vFName;
        Core.mXMLsource = "<drd>\r\n</drd>";
        
        saveXML();
        
        loadXML_L2(Core.mXMLFileName);
    }        
}

void MainWindow::on_actionOpenBinary_triggered()
{
    selectBinFile();
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
        vReader.addData(Core.mXMLsource);
        
        int vToken = -1;
        while ((vToken != QXmlStreamReader::StartElement) && (vReader.atEnd() == false)) {
            vToken = vReader.readNext();
        }
        if (vToken == QXmlStreamReader::StartElement) {
            vCharStart = vReader.characterOffset();
            
            while ((Core.mXMLsource[vCharStart] == 0x20) ||
                (Core.mXMLsource[vCharStart] == 0xD) ||
                (Core.mXMLsource[vCharStart] == 0xA)) {
            
                vCharStart++;
            }
            
            vTabCount = 1;
            vInsertStr = QString(vTabCount, 0x9) + vItemString + "\r\n";
        } else {
            return;
        }
    } else {

        int vRefIndex = qWi->data(0, eElmRefRole).toInt();
        
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
    
    Core.mXMLsource.insert(vCharStart, vInsertStr);
    
    loadXML_L3();
}

void MainWindow::on_actionInsertChild_triggered()
{
    if (ui->wTree->topLevelItemCount() < 1) {return;}
    
    QTreeWidgetItem *qWi;
    qWi = ui->wTree->currentItem();
    
    if (qWi == 0) {return;}
    
    QString vItemString = "<item ptr=\"0\" type=\"BLANK\"/>";
    
    int vRefIndex = qWi->data(0, eElmRefRole).toInt();

    int vTabCount = 0;
    
    QDomElement vChild = Core.mItemElmTable[vRefIndex].mElmRef.firstChildElement();
    int vStart = Core.mItemElmTable[vRefIndex].mCharStart;
    int vEnd = Core.mItemElmTable[vRefIndex].mCharEnd;
    

    if (vChild.isNull() == true) {
        unloadXML();
        
        //Target element doesn't already have children.
        vTabCount = calculateTabOrder(vStart-1);
        
        //Reverse search for "/>" starting from the last character of the Element.
        int vWhere = Core.mXMLsource.lastIndexOf("/>", -1-(Core.mXMLsource.size()-1-vEnd));
        if (vWhere >= 0) {
            QString vInsertStr = ">\r\n"+QString(vTabCount+1, 0x9)+ \
                vItemString+"\r\n"+QString(vTabCount, 0x9)+"</item>";
            Core.mXMLsource.replace(vWhere, 2, vInsertStr);
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
        
            int vCharStart = Core.mItemElmTable[vChildIndex].mTrueCharStart;
            int vCharEnd = Core.mItemElmTable[vChildIndex].mCharEnd;
            
            vTabCount = calculateTabOrder(vCharStart-1);
    
            QString vInsertStr = "\r\n" + QString(vTabCount, 0x9) + vItemString;
            
            unloadXML();
            
            Core.mXMLsource.insert(vCharEnd+1, vInsertStr);
            
            loadXML_L3();
        }
    }
    
}

int MainWindow::calculateTabOrder(int aStart) {
    bool vFlag = true;
    int vTabCount = 0;
    int vCharStart2 = aStart;
    while ((vCharStart2 >= 0) && (vCharStart2 < Core.mXMLsource.size()) && (vFlag == true)) {
        if (Core.mXMLsource[vCharStart2] == 0x9) {
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
    int vCharStart = Core.mItemElmTable[vRefIndex].mCharStart;
    int vCharEnd = Core.mItemElmTable[vRefIndex].mCharEnd+1;
    
    unloadXML();
    
    //Remove all characters related to the element + child elements.
    Core.mXMLsource.remove(vCharStart, vCharEnd-vCharStart);
    
    //Clean up: Remove any /r and /n that came after the element
    bool vFlag = true;
    while ((vCharStart < Core.mXMLsource.size()) && (vFlag == true)) {
        if ((Core.mXMLsource[vCharStart] == '\r') || (Core.mXMLsource[vCharStart] == '\n')) {
            Core.mXMLsource.remove(vCharStart, 1);
        } else {
            vFlag = false;
        }
    }
    //Clean up: Remove any Tab (0xA) that preceeded the element
    vFlag = true;
    vCharStart--;
    while ((vCharStart >= 0) && (vCharStart < Core.mXMLsource.size()) && (vFlag == true)) {
        if (Core.mXMLsource[vCharStart] == 0x9) {
            Core.mXMLsource.remove(vCharStart, 1);
            vCharStart--;
        } else {
            vFlag = false;
        }
    }
    
    loadXML_L3();
}

void MainWindow::on_actionClearXML_triggered()
{

    int vResult = QMessageBox::warning(this, "Flexible Editor", \
        "This will remove ALL elements in the XML and leave only a base Element. \n\
Do you wish to continue?", QMessageBox::Yes|QMessageBox::No, QMessageBox::No);

    if (vResult == QMessageBox::Yes) {
        unloadXML();
        Core.mXMLsource = "<drd>\r\n</drd>";
        loadXML_L3();
    }
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
    QString vNew = ui->wXMLEdit->toPlainText();
    int vFirstChar = Core.mItemElmTable[Core.mXMLEditIndex].mCharStart;
    int vLastChar = Core.mItemElmTable[Core.mXMLEditIndex].mCharEnd+1;
    Core.mXMLsource = Core.mXMLsource.replace(vFirstChar, vLastChar-vFirstChar, vNew);
    unloadXML();
    loadXML_L3();
    
}

