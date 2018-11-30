import { Observable } from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { AppService, App } from 'app/services/app.service';
import { UserComment, CommentsService } from '../../services/comments.service';

@Component({
  selector: 'dstore-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @ViewChild('dialog')
  dialogRef: ElementRef<HTMLDialogElement>;
  deleteConfirm: boolean;
  app$: Observable<App>;
  content: string;
  rate: number;
  version: string;
  _comment: UserComment;
  @Output()
  close = new EventEmitter<boolean>();
  @Input()
  set comment(c: UserComment) {
    if (!this.dialogRef.nativeElement.open) {
      this.dialogRef.nativeElement.showModal();
    }
    this._comment = c;
    this.content = c.content;
    this.rate = c.rate / 2;
    this.version = c.version;
    this.app$ = this.appService.getApp(c.appName, false, false);
  }
  constructor(private commentService: CommentsService, private appService: AppService) {}

  ngOnInit() {
    this.dialogRef.nativeElement.addEventListener('close', () => {
      this.closed();
    });
  }
  closed(changed: boolean = false) {
    this.close.emit(changed);
  }
  submit() {
    this.commentService.delete(this._comment.id).subscribe(() => {
      this.commentService
        .create(this._comment.appName, this.content, this.rate * 2, this._comment.version)
        .subscribe(() => {
          this.closed(true);
        });
    });
  }
  delete() {
    this.commentService.delete(this._comment.id).subscribe(() => {
      this.closed();
    });
  }
}
