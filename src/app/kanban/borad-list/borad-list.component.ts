import { Component, OnInit, OnDestroy } from "@angular/core";
import { Board } from "../board.model";
import { Subscription } from "rxjs";
import { BoardService } from "../board.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { BoardDialogComponent } from "../dialogs/board-dialog.component";

@Component({
  selector: "app-borad-list",
  templateUrl: "./borad-list.component.html",
  styleUrls: ["./borad-list.component.scss"],
})
export class BoradListComponent implements OnInit, OnDestroy {
  boards: Board[];
  connectedTo: string[] = [];
  sub: Subscription;
  constructor(private boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.sub = this.boardService.getUserBoards().subscribe((boards) => {
      this.boards = boards;
      for (let board of this.boards) {
        this.connectedTo.push("board_" + board.id);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.boardService.sortBoards(this.boards);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openBoardDialog(): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: "400px",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.boardService.createBoard({
          title: result,
          priority: this.boards.length,
        });
      }
    });
  }
}
