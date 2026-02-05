#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QTreeWidget>
#include <QDomNode>
#include <QXmlStreamReader>
#include <QScriptEngine>

#include <QGraphicsView>
#include <QGraphicsScene>
#include <QByteArray>
#include <QTime>

#include "itemview.h"
#include "script.h"

namespace Ui {
class MainWindow;
}

enum { eElmRefRole = Qt::UserRole, eWindowRole} ;
enum { eBufferSystem_Single = 0, eBufferSystem_WriteBuffer} ;


struct XMLReadStatus {
    int mItemCount;
    QTreeWidgetItem *mParentTWIRef;
    int mTreeLevel;
    int mListFloorCounter;
    int mCurrentSrcLine;
    int mCharPos;
    bool mValidCharPos;
    int mParentIndex;
};

struct tItemElmType {
    QDomElement mElmRef;
    ItemView *mItemViewRef;
    int mParentIndex;
    QList<int> mChildIndexes;
    int mArrayIndex;
    int mArrayByteSz;
    int mBigEndianByteSz;
    bool mHasCharPos;
    quint32 mCharStart;
    quint32 mTrueCharStart;
    quint32 mCharEnd;
};

struct tIconTableItem {
    QString mKey;
    QIcon mIcon;
};

class tCore {
public:
    tCore();
    ~tCore();
    
    bool mXMLFileOpened;
    QString mXMLSource;
    QString mXMLFileName;
    QString mXMLFileBasePath;
    bool mXMLSourceHasEditBackup;
    QString mXMLSourceRevertBackup;
    
    int mXMLEditIndex;

    bool mBinFileOpened;
    QString mBinFileName;
    
    QDomDocument mMainXML;
   
    QList<tItemElmType> mItemElmTable;
    
    QList<int> mCommonElmIndexTable;
    QList<int> mListElmIndexTable;
    
    QList<tIconTableItem> mIconTable;
    
    //Binary Buffering ->
    int mBufferSystem;
    QByteArray mEditFileFullBuffer; //Contains the whole file for eBufferSystem_Single, otherwise empty.
    quint32 mBufferBlockSize;
    QList<quint32> mBufferBlockLocations;
    QList<QByteArray> mBufferBlockData;
    QFile mLockedBinQFile;
    //<-
    
    QString mDefaultNESPALFile;
    QByteArray mNESPal;
  
    tEventForScript *mEventForScript;
    
    QString mProgramTitle;
    QString mTypeScriptPath;
    
    int mDRD_intSize;
    int mVersionDate;
    
    QIcon mDefaultIcon;
    
    QStringList mCustomizeId;
    QStringList mCustomizeString;
    
    bool mLowLevelErrorFlag;
    
    #ifdef QT_DEBUG
    QTime mBenchmarkTime;
    #endif

    void error(QString aMessage, int aLevel);
    void themeChange();
    void scriptEnvSetup(QScriptEngine *aEngine, QWidget *aWindowVar, int aElmRefIndex);
    void initTypeScript(int aElementRef, QScriptEngine *aEngine);
    void scriptLoad(QString aFileName, QScriptEngine *aEngine);
    bool qElementGetHasAttribute(QDomElement aElement, QString aName, QString *aReturnStr);
    quint32 getItemByte(qint32 aPtr, QDomElement aElmRef, int aElmIndex = -1);
    void setItemByte(qint32 aPtr, quint32 aValue, QDomElement aElmRef, int aElmIndex = -1);
    qint64 calcItemPtr(qint32 aPtr, QDomElement aElmRef, int aElmIndex = -1, bool aCheckBigEndian = true);
    bool itemHasAttr(QString aName, QDomElement aElmRef, bool aCheckCommon = true, bool aCheckRegular = true);
    QString getItemAttr(QString aName, QDomElement aElmRef);
    bool getItemFlag(QString aFlagName, QDomElement aElmRef);
    quint32 getFileByte(qint64 aPtr);
    void setFileByte(qint64 aPtr, quint32 aValue);
    int getCommonElementIndex(QDomElement aElmRef);
    QDomElement getEngineElmRef(QScriptEngine *aEngine);
    int getEngineElmIndex(QScriptEngine *aEngine);

    void saveXML();
    bool loadDocument(QString aFileName, QString *aDocument);
    bool loadFileCommon(QString aFName, QByteArray *aByteArray);
    bool findIncludeFile(QString *aFName);
   
 
};

extern tCore Core;

class MainWindow : public QMainWindow
{
    Q_OBJECT
    
public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private slots:
    void on_wTree_currentItemChanged(QTreeWidgetItem *current, QTreeWidgetItem *previous);
    void on_wTree_itemClicked(QTreeWidgetItem *item, int column);
    void on_actionOpenXML_triggered();
    void on_actionOpenBinary_triggered();
    void on_actionSaveBinary_triggered();
    void on_actionExit_triggered();
    void on_mdiArea_subWindowActivated(QMdiSubWindow *arg1);
    void on_wUpdate_clicked();
    void on_actionSaveXML_triggered();
    void on_actionInsertItem_triggered();
    void on_actionDeleteItem_triggered();
    void on_actionReloadXML_triggered();
    void on_actionClearXML_triggered();
    void on_actionInsertChild_triggered();
    void on_actionNewXML_triggered();
    
    void on_actionOpenBinBufMode_triggered();
    
    void on_actionViewWBufferStats_triggered();
    
    void on_actionThemeIceDragon_triggered();
    
    void on_actionThemeNormal_triggered();
    
public:
    void dev_init_();
    void loadXMLFile(QString aFName);
    void loadXML_L2(QString aFName);
    void loadXML_L3();
    void loadXML_L4();
    void loadXMLRecursive();
    void loadXMLRecursive(QDomElement aElement, XMLReadStatus *aStatus, QXmlStreamReader *aReader);
    void loadXMLRecursive_findReaderToken(int aToken, XMLReadStatus *aStatus, QXmlStreamReader *aReader);
    void loadBinFile(QString aFName, int aMode);
    void saveBinFile(QString aFName);
    void dev_init_combo_(QString aXML, QString aBIN, int aBufferMode = eBufferSystem_Single);
    void load_NES_Palette(QString aFName);
    void selectXMLfile();
    void selectBinFile(bool aForceBufferMode = false);
    void unloadXML();
    void init();
    void updateWindowTitle();
    void disableDirectEdit();
    void closeEvent(QCloseEvent *aCEvent);
    int calculateTabOrder(int aStart);
    
private:
    Ui::MainWindow *ui;
};

#endif // MAINWINDOW_H
