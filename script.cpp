
#include "script.h"
#include "mainwindow.h"

#include <QMessageBox>


static QScriptValue scriptF_hasText(QScriptContext *aContext, QScriptEngine *aEngine) {
    QDomElement vElement = Core.getEngineElmRef(aEngine).toElement();
    QDomNodeList vDNL = vElement.childNodes();
    for (int vCount = 0; vCount < vDNL.count(); vCount++) {
        if (vDNL.item(vCount).isText() == true) {
            return true;
        }
    }
    
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

    if (aContext->argumentCount() > 0) {
        //quint64 vArgPointer = aContext->argument(0).toVariant().toULongLong();
        qint32 vArgPointer = aContext->argument(0).toUInt32();
        int vIndex = Core.getEngineElmIndex(aEngine);
       
        return(Core.getItemByte(vArgPointer, Core.mItemElmTable[vIndex].mElmRef, vIndex));
    
    }
    return 0;
}

static QScriptValue scriptF_setByte(QScriptContext *aContext, QScriptEngine *aEngine) {
    
    if (aContext->argumentCount() > 1) {
        qint32 vArgPointer = aContext->argument(0).toUInt32();
        quint32 vValue = aContext->argument(1).toUInt32();
        int vIndex = Core.getEngineElmIndex(aEngine);
        
        Core.setItemByte(vArgPointer, vValue, Core.mItemElmTable[vIndex].mElmRef, vIndex);
    
    }
    return 0;
}

static QScriptValue scriptF_getByteAbs(QScriptContext *aContext, QScriptEngine *aEngine) {

    if (aContext->argumentCount() > 0) {
        quint64 vArgPointer = aContext->argument(0).toVariant().toULongLong();
        return(Core.getFileByte(vArgPointer));
    
    }
    return 0;
}

static QScriptValue scriptF_setByteAbs(QScriptContext *aContext, QScriptEngine *aEngine) {

    if (aContext->argumentCount() > 1) {
        quint64 vArgPointer = aContext->argument(0).toVariant().toULongLong();
        quint32 vValue = aContext->argument(1).toUInt32();
        Core.setFileByte(vArgPointer, vValue);
    }
    return 0;
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

    if (aContext->argumentCount() > 0) {
        int vByteSize = aContext->argument(0).toInt32();
        int vElmIndex = Core.getEngineElmIndex(aEngine);
        Core.mItemElmTable[vElmIndex].mArrayByteSz = vByteSize;
    }
    return 0;
}

static QScriptValue scriptF_setBigEndianByteSize(QScriptContext *aContext, QScriptEngine *aEngine) {

    if (aContext->argumentCount() > 0) {
        int vByteSize = aContext->argument(0).toInt32();
        int vElmIndex = Core.getEngineElmIndex(aEngine);
        Core.mItemElmTable[vElmIndex].mBigEndianByteSz = vByteSize;
    }
    return 0;
}


static QScriptValue scriptF_getElementIndex(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    QScriptValue vGlob = aEngine->globalObject();
    QScriptValue vCore = vGlob.property("Core");
    int vIndex = vCore.property("elmRefIndex").toInteger();
    vReturnVal = vIndex;
    return vReturnVal;
}

static QScriptValue scriptF_getBinarySize(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    if (Core.mBinFileOpened == true) {
        if (Core.mBufferSystem == eBufferSystem_Single) {
        
            vReturnVal = Core.mEditFileFullBuffer.size();
        } else if (Core.mBufferSystem == eBufferSystem_WriteBuffer) {
        
            qsreal vSize = Core.mLockedBinQFile.size();
            vReturnVal = QScriptValue(vSize);

        }
    } else {
        vReturnVal = -1;
    }
    return vReturnVal;
}

static QScriptValue scriptF_getActivePtr(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    int vIndex = Core.getEngineElmIndex(aEngine);
    qsreal vPtr = Core.calcItemPtr(0, Core.mItemElmTable[vIndex].mElmRef, vIndex, false);
    return QScriptValue(vPtr);
}

static QScriptValue scriptF_fetchElementData(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    QScriptEngine vFetchEngine;
    if (aContext->argumentCount() > 0) {
        int vIndex = aContext->argument(0).toInteger();

        Core.initTypeScript(vIndex, &vFetchEngine);
        scriptEnvSetup(&vFetchEngine, 0, vIndex);
        
        QScriptValue vGlob = vFetchEngine.globalObject();
        QScriptValue vInitFunc = vGlob.property("initFetch");
        
        QScriptValue vData = vInitFunc.call();

        if (vFetchEngine.hasUncaughtException()) {
            QMessageBox vErrorBox;
            QString vError;
            vError = vFetchEngine.uncaughtException().toString();
            vErrorBox.setText(vError);
            vErrorBox.exec();
            return vReturnVal;
        }

        QVariant vData2 = vData.toVariant();
        QList<QVariant> vData3 = vData2.toList();
        QScriptValue vData4 = aEngine->newArray(vData3.count());
        for (int vIx = 0; vIx < vData3.count(); vIx++) {
            vData4.setProperty(vIx, vData3.at(vIx).toInt());
        }
        return vData4;
    }
    return vReturnVal;
}

static QScriptValue scriptF_childElementIndex(QScriptContext *aContext, QScriptEngine *aEngine) {
    QScriptValue vReturnVal = -1;
    if (aContext->argumentCount() > 0) {
        QString vElementName = aContext->argument(0).toString();
        int vElementRef = Core.getEngineElmIndex(aEngine);
        for (int vCount = 0; vCount < Core.mItemElmTable[vElementRef].mChildIndexes.count(); vCount++) {
            int vChildElementIndex = Core.mItemElmTable[vElementRef].mChildIndexes.at(vCount);
            QDomElement vChildElm = Core.mItemElmTable[vChildElementIndex].mElmRef;
            if (vChildElm.nodeName().compare(vElementName, Qt::CaseInsensitive) == 0) {
                vReturnVal = vChildElementIndex;
                break;
            } 
        }
    }
    return vReturnVal;
}

static QScriptValue scriptF_customize(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal;
    if (aContext->argumentCount() > 1) {
        QString vAttrName = aContext->argument(0).toString();
        bool vHas2ndPrio = false;
        QString v2ndPrioAttrName = "";
        if (aContext->argumentCount() > 2) {
            vHas2ndPrio = true;
            v2ndPrioAttrName = aContext->argument(2).toString();
        }

        bool vFlag = false;
        
        vReturnVal = aContext->argument(1);
        if (Core.itemHasAttr(vAttrName, Core.getEngineElmRef(aEngine))) {
            vReturnVal = Core.getItemAttr(vAttrName, Core.getEngineElmRef(aEngine));
            vFlag = true;
        } else {
            if (vHas2ndPrio == true) {
                if (Core.itemHasAttr(v2ndPrioAttrName, Core.getEngineElmRef(aEngine))) {
                    vReturnVal = Core.getItemAttr(v2ndPrioAttrName, Core.getEngineElmRef(aEngine));
                    vFlag = true;
                }
            }
        }
        
        if (vFlag == false) {
          int vIndex = Core.mCustomizeId.indexOf(vAttrName);
          if (vIndex >= 0) {
            vReturnVal = Core.mCustomizeString[vIndex];
          } else {
            if (vHas2ndPrio == true) {
                int vIndex2 = Core.mCustomizeId.indexOf(v2ndPrioAttrName);
                if (vIndex2 >= 0) {
                   vReturnVal = Core.mCustomizeString[vIndex2];
                }
            }
          }
        }
    }
    
    return vReturnVal;
}

static QScriptValue scriptF_getList(QScriptContext *aContext, QScriptEngine *aEngine) {
    QScriptValue vReturnVal;
    
    if (aContext->argumentCount() > 0) {
        QString vListKey = aContext->argument(0).toString();
        for (int vIndex = 0; vIndex < Core.mListElmIndexTable.count(); vIndex++) {
            QDomElement vElement = Core.mItemElmTable[Core.mListElmIndexTable[vIndex]].mElmRef;
            //Fix 25-12-03: Now detects both lowercase and uppercase "key" attribute.
            QString vThisKey = "";
            Core.qElementGetHasAttribute(vElement, "key", &vThisKey);
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
        QString vFileData;
        QString vFileName = aContext->argument(0).toString();
        bool vResult1 = Core.findIncludeFile(&vFileName);
        if (vResult1 == true) {
            bool vResult2 = Core.loadDocument(vFileName, &vFileData);
            if (vResult2 == true) {
                return (vFileData);
            }
        }
        Core.error("Core.loadTextFile could not load: " + vFileName, 1);
    }
    
    return (vReturnVal);
}

static QScriptValue scriptF_stringDecode(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal = "";
    if (aContext->argumentCount() >= 3) {
        
        QScriptValue vArray = aContext->argument(0).toObject();
        qint32 vElementCount = aContext->argument(1).toInt32();
        QString vEncoding = aContext->argument(2).toString();
        QByteArray vByteArray;
        
        if (vElementCount > 0) {
             
            for (int vX = 0; vX < vElementCount; vX++) {
               vByteArray.append(vArray.property(vX).toInt32());
            }
            vByteArray.append((char)0);
            
            if (vEncoding.compare("UTF-8", Qt::CaseInsensitive) == 0) {
                QString vString = QString::fromUtf8(vByteArray);
                QScriptValue vReturnObject = aEngine->newObject();
                vReturnObject.setProperty("size", vString.size());
                vReturnObject.setProperty("data", vString);
                return (vReturnObject);
            }
        } 
    }
    
    return (vReturnVal);
}

static QScriptValue scriptF_stringEncode(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal = "";
    if (aContext->argumentCount() >= 3) {
        
        QString vString = aContext->argument(0).toString();
        qint32 vCharCount = aContext->argument(1).toInt32();
        QString vEncoding = aContext->argument(2).toString();
        QByteArray vByteArray;
        
        if (vCharCount > 0) {

            if (vEncoding.compare("UTF-8", Qt::CaseInsensitive) == 0) {
                vByteArray = vString.toUtf8();
                
                QScriptValue vScriptByteArray;
                QVector<uchar> vTempConvert(vByteArray.size());
                memcpy(vTempConvert.data(), vByteArray.data(), vByteArray.size());
                vTempConvert.append(0);
                vScriptByteArray = qScriptValueFromSequence(aEngine, vTempConvert);
                
                QScriptValue vReturnObject = aEngine->newObject();
                vReturnObject.setProperty("size", vByteArray.size());
                vReturnObject.setProperty("data", vScriptByteArray);
                return (vReturnObject); 
                
            }
        } 
    }
    
    return (vReturnVal);
}

#ifdef QT_DEBUG

static QScriptValue scriptF_getMSTimer(QScriptContext *aContext, QScriptEngine *aEngine) {

    QScriptValue vReturnVal = 0;
    vReturnVal = Core.mBenchmarkTime.elapsed();
    return vReturnVal;
}

#endif

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

void BitmapView::mouseMoveEvent(QMouseEvent *event) {   
   int x = event->x();
   int y = event->y();
   int button = event->buttons();
   
   emit mouseMove(button, y, x);
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

void BitmapView::drawBuffer(int aY1, int aY2, int aX1, int aX2, QVariantList aBuffer) {

    int vIndexCount = 0;
    int vLenY = (aY2 - aY1)+1;
    int vLenX = (aX2 - aX1)+1;
    int vLineByteJump = mImage.width() - vLenX;
    QRgb *pixp = (QRgb*) mImage.scanLine(aY1);
    pixp += aX1;
    for (int y = 0; y < vLenY; y++) {
    for (int x = 0; x < vLenX; x++) {
        *pixp++ = QRgb(aBuffer.at(vIndexCount++).toInt());
    }
    pixp += vLineByteJump;
    }
}


/*tEventForScript::tEventForScript(QWidget *parent) {
    QWidget *par = parent;
    QObject::QObject(par);
}*/

void tEventForScript::dispatch(int aEventCode) {
    emit signal(aEventCode);
}

void scriptEnvSetup(QScriptEngine *aEngine, QWidget *aWindowVar, int aElmRefIndex ) {
    QScriptValue vGlob = aEngine->globalObject();    

    QScriptValue vEvent = aEngine->newQObject(Core.mEventForScript);
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
    vGlob.setProperty("QTimer", aEngine->scriptValueFromQMetaObject<QTimerSC>());
    
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
    vCore.setProperty("getByteAbs", aEngine->newFunction(&scriptF_getByteAbs, 1));
    vCore.setProperty("setByteAbs", aEngine->newFunction(&scriptF_setByteAbs, 2));
    vCore.setProperty("getElementIndex", aEngine->newFunction(&scriptF_getElementIndex, 0));
    vCore.setProperty("getBinarySize", aEngine->newFunction(&scriptF_getBinarySize, 0));
    vCore.setProperty("getActivePtr", aEngine->newFunction(&scriptF_getActivePtr, 0));
    vCore.setProperty("setArrayIndex", aEngine->newFunction(&scriptF_setArrayIndex, 1));
    vCore.setProperty("getArrayIndex", aEngine->newFunction(&scriptF_getArrayIndex, 0));
    vCore.setProperty("setBigEndianByteSize", aEngine->newFunction(scriptF_setBigEndianByteSize, 1));
    vCore.setProperty("setArrayByteSize", aEngine->newFunction(&scriptF_setArrayByteSize, 1));
    vCore.setProperty("childElementIndex", aEngine->newFunction(&scriptF_childElementIndex, 1));
    vCore.setProperty("fetchElementData", aEngine->newFunction(&scriptF_fetchElementData, 1));  
    vCore.setProperty("customize", aEngine->newFunction(&scriptF_customize, 3));
    vCore.setProperty("getList", aEngine->newFunction(&scriptF_getList, 1));
    vCore.setProperty("loadTextFile", aEngine->newFunction(&scriptF_loadTextFile, 1));
    vCore.setProperty("stringDecode", aEngine->newFunction(&scriptF_stringDecode, 3));
    vCore.setProperty("stringEncode", aEngine->newFunction(&scriptF_stringEncode, 3));
    #ifdef QT_DEBUG
    vCore.setProperty("getMSTimer", aEngine->newFunction(&scriptF_getMSTimer, 0));
    #endif
    
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
