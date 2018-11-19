import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';

import { JobService } from 'app/services/job.service';
import { AppService, App } from 'app/services/app.service';
import { StoreService } from 'app/modules/client/services/store.service';
import { InstalledApp } from 'app/modules/client/models/installed';
import { StoreJobType } from 'app/modules/client/models/store-job-info';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalAppService {
  metadataServer = environment.metadataServer;
  constructor(
    private jobService: JobService,
    private storeService: StoreService,
    private appService: AppService,
  ) {}
  LocalAppList() {
    return this.jobService.jobList().pipe(
      switchMap(() => this.storeService.getInstalledApps()),
      switchMap(
        installed => this.appService.getApps(installed.map(app => app.name)),
        (installed: LocalAppInfo[], appInfos) => {
          installed = installed
            .reduce((acc: LocalAppInfo[], app) => {
              app.app = appInfos.find(info => info.packageURI.includes(app.dpk));
              if (app.app) {
                acc.push(app);
              }
              return acc;
            }, [])
            .sort((a, b) => b.time - a.time);
          return installed;
        },
      ),
    );
  }
  RemovingList() {
    return this.jobService.jobsInfo().pipe(
      map(jobs => {
        return jobs
          .filter(job => job.type === StoreJobType.uninstall)
          .map(job => job.names)
          .reduce((acc, names) => {
            acc.push(...names);
            return acc;
          }, []);
      }),
    );
  }
  RemoveLocalApp(app: LocalAppInfo) {
    this.storeService.removePackage(app.name, app.app.localInfo.description.name);
  }
}
export interface LocalAppInfo extends InstalledApp {
  app: App;
}
