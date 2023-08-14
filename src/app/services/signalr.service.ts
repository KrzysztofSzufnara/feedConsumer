import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Feed } from '../feed.model';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  public data?: Feed;
  private hubConnection?: signalR.HubConnection;

  public startConnection() {
    return new Promise((resolve, reject) => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:5001/feed')
        .build();

      this.hubConnection
        .start()
        .then(() => {
          console.log('connection established');
          return resolve(true);
        })
        .catch((err: any) => {
          console.log('error occured' + err);
          reject(err);
        });
    });
  }

  private $allFeed: Subject<Feed> = new Subject<Feed>();

  public get AllFeedObservable(): Observable<Feed> {
    return this.$allFeed.asObservable();
  }

  public listenToAllFeeds() {
    (<signalR.HubConnection>this.hubConnection).on('GetFeed', (data: Feed) => {
      this.$allFeed.next(data);
    });
  }

  constructor() {}
}
