#ifndef ITEMVIEW_H
#define ITEMVIEW_H

#include <QWidget>
#include <QTreeWidgetItem>
#include <QScriptEngine>
#include <QMdiSubWindow>

namespace Ui {
class ItemView;
}

//#define SUBWINDOWTYPE
#ifdef SUBWINDOWTYPE
    typedef QMdiSubWindow ItemViewWindow ;
#else
    typedef QWidget ItemViewWindow ;
#endif

class ItemView : public ItemViewWindow
{
    Q_OBJECT
    
public:
    explicit ItemView(QWidget *parent = 0);
    ~ItemView();
    
   // MainWindow *mMainWnd;
    QTreeWidgetItem *mTreeItemRef;
    
    int mElementRef;
    
    void initTypeScript();
    void focusInEvent(QFocusEvent *aEventData);
    void showEvent(QShowEvent *aEventData);
    void closeEvent(QCloseEvent *aEventData);

    Ui::ItemView *ui;
private:
    QScriptEngine mScriptEngine;
};

#endif // ITEMVIEW_H
