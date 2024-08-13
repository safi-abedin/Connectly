import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.scss'
})
export class JoinRoomComponent implements OnInit {
    joinRoomForm! : FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);
    chatService = inject(ChatService);

    ngOnInit(): void {
      this.joinRoomForm = this.fb.group({
         user:['',[Validators.required,Validators.maxLength(15)]],
         room:['',Validators.required]
      });
    }

    joinRoom(){
      const {user,room} = this.joinRoomForm.value;
      sessionStorage.setItem("user",user);
      this.chatService.joinRoom(user,room)
      .then(()=>{
        this.router.navigate(['chat']);
      })
      .catch((err)=>{
           console.log(err);
      })
    }
}
