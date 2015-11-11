#include <QDebug>
#include <QProcess>

#include "main.h"
#include "Shell.h"

#ifndef GIT_DESCRIBE_VERSION
    #define GIT_DESCRIBE_VERSION NA
#endif

bool restartQtLoop = true;

int main(int argc, char *argv[]) {
    Shell::setApplicationName("Deepin Store");
    Shell::setApplicationVersion(GIT_DESCRIBE_VERSION);
    Shell::setOrganizationDomain("deepin.org");
    Shell::setOrganizationName("Deepin");

    Shell shell(argc, argv);
    int result = shell.exec();

    if (restartQtLoop) {
        QString program = QString(argv[0]);
        QStringList args;
        for (int i = 1; i < argc ; i++) {
            args << argv[i];
        }
        qDebug() << "Starting another instance";
        QProcess::startDetached(program, args);
    }

    return result;
}
