import { NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  standalone:true,
  imports:[ReactiveFormsModule,NgFor,NgClass,NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit,AfterViewChecked {
  groupName: string = 'Group Name';
  connectedUsers: string[] = [];
  messages:any[] = [];
  chatService = inject(ChatService);
  chatForm!: FormGroup;
  readonly fb = inject(NonNullableFormBuilder);
  loggedInUser = sessionStorage.getItem("user");
  private readonly toastr = inject(ToastrService);
  router = inject(Router);
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.chatService.messages$.subscribe(res=>{
         this.messages = res;
    });
    this.chatService.connectedUsers$.subscribe(res=>{
         this.connectedUsers = res;
    });
    this.chatService.roomName$.subscribe(res=>{
      this.groupName = res;
 });
    this.chatForm = this.fb.group({
         message: ['', Validators.required]
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    const element = this.chatContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  get message() {
    return this.chatForm.get('message');
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      var m:string =  this.message?.value;
      this.chatService.sendMessage(m)
      .then(()=>{
         this.chatForm.reset();
      })
      .catch((err)=>{
          console.log(err);
      });
    }
  }

  leaveChat(){
    this.chatService.leaveChat();
    this.router.navigate(['welcome']);
  }
}
