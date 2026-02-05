#include <QtGui/QApplication>
#include "mainwindow.h"

//#include <QCommonStyle>
//#include <QPlastiqueStyle>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
//    QCommonStyle *mStyle = new QPlastiqueStyle();
//    a.setStyle(mStyle);
    MainWindow w;
    w.show();
    
    return a.exec();
}
