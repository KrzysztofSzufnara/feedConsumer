import { Component } from '@angular/core';
import { Feed } from './feed.model';
import { SignalrService } from './services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  feed: Feed[] = [];
  allFeedSubscription: any;

  constructor(private signalrService: SignalrService) {}

  ngOnInit(): void {
    // 1 - start a connection
    this.signalrService.startConnection().then(() => {
      console.log('connected');

      // 2 - register for ALL relay
      this.signalrService.listenToAllFeeds();

      // 3 - subscribe to messages received
      this.allFeedSubscription =
        this.signalrService.AllFeedObservable.subscribe((res: Feed) => {
          this.feed.push(res);
          console.log(res);
        });
    });
  }

  ngOnDestroy(): void {
    (<Subscription>this.allFeedSubscription).unsubscribe();
  }

  title = 'FeedConsumerApp';
}
