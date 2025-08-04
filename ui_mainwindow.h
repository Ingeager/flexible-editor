/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created: Tue 5. Aug 01:11:29 2025
**      by: Qt User Interface Compiler version 4.8.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtGui/QAction>
#include <QtGui/QApplication>
#include <QtGui/QButtonGroup>
#include <QtGui/QHBoxLayout>
#include <QtGui/QHeaderView>
#include <QtGui/QMainWindow>
#include <QtGui/QMdiArea>
#include <QtGui/QMenu>
#include <QtGui/QMenuBar>
#include <QtGui/QPlainTextEdit>
#include <QtGui/QPushButton>
#include <QtGui/QSpacerItem>
#include <QtGui/QStatusBar>
#include <QtGui/QToolBar>
#include <QtGui/QTreeWidget>
#include <QtGui/QVBoxLayout>
#include <QtGui/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *actionOpenXML;
    QAction *actionOpenBinary;
    QAction *actionImport_XML;
    QAction *actionSaveBinary;
    QAction *actionExit;
    QWidget *centralWidget;
    QWidget *horizontalLayoutWidget;
    QHBoxLayout *horizontalLayout;
    QTreeWidget *wTree;
    QVBoxLayout *verticalLayout;
    QMdiArea *mdiArea;
    QHBoxLayout *horizontalLayout_2;
    QPlainTextEdit *wXMLEdit;
    QVBoxLayout *verticalLayout_2;
    QPushButton *wUpdate;
    QSpacerItem *verticalSpacer_2;
    QMenuBar *menuBar;
    QMenu *menuFile;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QString::fromUtf8("MainWindow"));
        MainWindow->resize(1107, 758);
        QIcon icon;
        icon.addFile(QString::fromUtf8("testlogo.bmp"), QSize(), QIcon::Normal, QIcon::Off);
        MainWindow->setWindowIcon(icon);
        actionOpenXML = new QAction(MainWindow);
        actionOpenXML->setObjectName(QString::fromUtf8("actionOpenXML"));
        actionOpenBinary = new QAction(MainWindow);
        actionOpenBinary->setObjectName(QString::fromUtf8("actionOpenBinary"));
        actionImport_XML = new QAction(MainWindow);
        actionImport_XML->setObjectName(QString::fromUtf8("actionImport_XML"));
        actionImport_XML->setEnabled(false);
        actionSaveBinary = new QAction(MainWindow);
        actionSaveBinary->setObjectName(QString::fromUtf8("actionSaveBinary"));
        actionExit = new QAction(MainWindow);
        actionExit->setObjectName(QString::fromUtf8("actionExit"));
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QString::fromUtf8("centralWidget"));
        horizontalLayoutWidget = new QWidget(centralWidget);
        horizontalLayoutWidget->setObjectName(QString::fromUtf8("horizontalLayoutWidget"));
        horizontalLayoutWidget->setGeometry(QRect(20, 10, 841, 561));
        horizontalLayout = new QHBoxLayout(horizontalLayoutWidget);
        horizontalLayout->setSpacing(6);
        horizontalLayout->setContentsMargins(11, 11, 11, 11);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        wTree = new QTreeWidget(horizontalLayoutWidget);
        QTreeWidgetItem *__qtreewidgetitem = new QTreeWidgetItem();
        __qtreewidgetitem->setText(0, QString::fromUtf8("1"));
        wTree->setHeaderItem(__qtreewidgetitem);
        wTree->setObjectName(QString::fromUtf8("wTree"));
        QSizePolicy sizePolicy(QSizePolicy::Fixed, QSizePolicy::Expanding);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(wTree->sizePolicy().hasHeightForWidth());
        wTree->setSizePolicy(sizePolicy);
        wTree->setMinimumSize(QSize(250, 0));
        wTree->setMaximumSize(QSize(250, 16777215));
        wTree->setProperty("showDropIndicator", QVariant(true));
        wTree->setDragEnabled(true);
        wTree->setRootIsDecorated(true);
        wTree->setColumnCount(1);
        wTree->header()->setVisible(false);

        horizontalLayout->addWidget(wTree);

        verticalLayout = new QVBoxLayout();
        verticalLayout->setSpacing(6);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        verticalLayout->setContentsMargins(-1, -1, -1, 0);
        mdiArea = new QMdiArea(horizontalLayoutWidget);
        mdiArea->setObjectName(QString::fromUtf8("mdiArea"));
        QSizePolicy sizePolicy1(QSizePolicy::Preferred, QSizePolicy::Expanding);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(mdiArea->sizePolicy().hasHeightForWidth());
        mdiArea->setSizePolicy(sizePolicy1);
        mdiArea->setVerticalScrollBarPolicy(Qt::ScrollBarAsNeeded);
        mdiArea->setHorizontalScrollBarPolicy(Qt::ScrollBarAsNeeded);

        verticalLayout->addWidget(mdiArea);

        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setSpacing(6);
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        wXMLEdit = new QPlainTextEdit(horizontalLayoutWidget);
        wXMLEdit->setObjectName(QString::fromUtf8("wXMLEdit"));
        QSizePolicy sizePolicy2(QSizePolicy::Expanding, QSizePolicy::Fixed);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(wXMLEdit->sizePolicy().hasHeightForWidth());
        wXMLEdit->setSizePolicy(sizePolicy2);
        wXMLEdit->setMinimumSize(QSize(0, 0));
        wXMLEdit->setMaximumSize(QSize(16777215, 50));
        wXMLEdit->setBaseSize(QSize(0, 0));

        horizontalLayout_2->addWidget(wXMLEdit);

        verticalLayout_2 = new QVBoxLayout();
        verticalLayout_2->setSpacing(6);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        wUpdate = new QPushButton(horizontalLayoutWidget);
        wUpdate->setObjectName(QString::fromUtf8("wUpdate"));
        wUpdate->setMinimumSize(QSize(55, 0));
        wUpdate->setMaximumSize(QSize(55, 16777215));

        verticalLayout_2->addWidget(wUpdate);

        verticalSpacer_2 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_2->addItem(verticalSpacer_2);


        horizontalLayout_2->addLayout(verticalLayout_2);


        verticalLayout->addLayout(horizontalLayout_2);


        horizontalLayout->addLayout(verticalLayout);

        MainWindow->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(MainWindow);
        menuBar->setObjectName(QString::fromUtf8("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 1107, 21));
        menuFile = new QMenu(menuBar);
        menuFile->setObjectName(QString::fromUtf8("menuFile"));
        MainWindow->setMenuBar(menuBar);
        mainToolBar = new QToolBar(MainWindow);
        mainToolBar->setObjectName(QString::fromUtf8("mainToolBar"));
        MainWindow->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(MainWindow);
        statusBar->setObjectName(QString::fromUtf8("statusBar"));
        MainWindow->setStatusBar(statusBar);

        menuBar->addAction(menuFile->menuAction());
        menuFile->addAction(actionOpenBinary);
        menuFile->addAction(actionSaveBinary);
        menuFile->addSeparator();
        menuFile->addAction(actionOpenXML);
        menuFile->addAction(actionImport_XML);
        menuFile->addSeparator();
        menuFile->addAction(actionExit);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "Flexible Editor (Build 1)", 0, QApplication::UnicodeUTF8));
        actionOpenXML->setText(QApplication::translate("MainWindow", "Open XML file..", 0, QApplication::UnicodeUTF8));
        actionOpenBinary->setText(QApplication::translate("MainWindow", "Open Binary file..", 0, QApplication::UnicodeUTF8));
        actionImport_XML->setText(QApplication::translate("MainWindow", "Import XML..", 0, QApplication::UnicodeUTF8));
        actionSaveBinary->setText(QApplication::translate("MainWindow", "Save Binary", 0, QApplication::UnicodeUTF8));
        actionExit->setText(QApplication::translate("MainWindow", "Exit", 0, QApplication::UnicodeUTF8));
        wUpdate->setText(QApplication::translate("MainWindow", "Update", 0, QApplication::UnicodeUTF8));
        menuFile->setTitle(QApplication::translate("MainWindow", "File", 0, QApplication::UnicodeUTF8));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
