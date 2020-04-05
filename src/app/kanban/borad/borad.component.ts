import { Component, OnInit, Input } from "@angular/core";
import { Board, Task } from "../board.model";
import { BoardService } from "../board.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { TaskDialogComponent } from "../dialogs/task-dialog.component";

@Component({
  selector: "app-borad",
  templateUrl: "./borad.component.html",
  styleUrls: ["./borad.component.scss"],
})
export class BoradComponent {
  @Input("Board") board: Board;
  @Input("connectedTo") connectedTo: string[];

  constructor(private boardService: BoardService, private dialog: MatDialog) {}

  taskDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.board.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.boardService.updateTasks(this.board.id, this.board.tasks);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.boardService.deleteTask(
        event.previousContainer.element.nativeElement.getAttribute(
          "data-board-id"
        ),
        <Task>event.container.data[event.currentIndex]
      );
      this.boardService.updateTasks(this.board.id, this.board.tasks);
    }
  }

  openDialog(task?: Task, idx?: number): void {
    const newTask = { label: "purple" };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: "500px",
      data: task
        ? { task: { ...task }, isNew: false, boardId: this.board.id, idx }
        : { task: newTask, isNew: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.isNew) {
          this.boardService.updateTasks(this.board.id, [
            ...this.board.tasks,
            result.task,
          ]);
        } else {
          const update = this.board.tasks;
          update.splice(result.idx, 1, result.task);
          this.boardService.updateTasks(this.board.id, this.board.tasks);
        }
      }
    });
  }

  handleDelete(): void {
    this.boardService.deleteBoard(this.board.id);
  }
}
