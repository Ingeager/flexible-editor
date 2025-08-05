/********************************************************************************
** Form generated from reading UI file 'itemview.ui'
**
** Created: Fri 4. Jul 00:23:34 2025
**      by: Qt User Interface Compiler version 4.8.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_ITEMVIEW_H
#define UI_ITEMVIEW_H

#include <QtCore/QVariant>
#include <QtGui/QAction>
#include <QtGui/QApplication>
#include <QtGui/QButtonGroup>
#include <QtGui/QHeaderView>
#include <QtGui/QWidget>

QT_BEGIN_NAMESPACE

class Ui_ItemView
{
public:

    void setupUi(QWidget *ItemView)
    {
        if (ItemView->objectName().isEmpty())
            ItemView->setObjectName(QString::fromUtf8("ItemView"));
        ItemView->resize(461, 339);
        QSizePolicy sizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(ItemView->sizePolicy().hasHeightForWidth());
        ItemView->setSizePolicy(sizePolicy);
        ItemView->setBaseSize(QSize(0, 0));

        retranslateUi(ItemView);

        QMetaObject::connectSlotsByName(ItemView);
    } // setupUi

    void retranslateUi(QWidget *ItemView)
    {
        ItemView->setWindowTitle(QApplication::translate("ItemView", "Form", 0, QApplication::UnicodeUTF8));
    } // retranslateUi

};

namespace Ui {
    class ItemView: public Ui_ItemView {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_ITEMVIEW_H
