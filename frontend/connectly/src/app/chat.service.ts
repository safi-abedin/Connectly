import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
 
  public connection:signalR.HubConnection = new signalR.HubConnectionBuilder()
                                  .withUrl("http://localhost:5102/chat")
                                  .configureLogging(signalR.LogLevel.Information)
                                  .build();
  public  messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public roomName$ = new BehaviorSubject<any>(null);
  messages:any[] = [];

  constructor() { 
    this.start();
    this.connection.on("ReciveMessage",(user:string,message:string,messageTime:string)=>{
       this.messages = [...this.messages,{user,message,messageTime}];
       this.messages$.next(this.messages);
    });
    this.connection.on("ConnectedUsers",(users:any,room:string)=>{
      this.connectedUsers$.next(users);
      this.roomName$.next(room);
   });
  }

  //start
  public async start(){
    try
    {
       await this.connection.start();
    }
    catch(error)
    {
      console.log(error);
       setTimeout(() => {
        this.start();
       }, 5000);
    }
  }

  //join room
  public async joinRoom(user:string,room:string){
    return this.connection.invoke("JoinRoom",{user,room});
  }

  //send message
  public async sendMessage(message:string){
    return this.connection.invoke("SendMessage",message);
  }

  //leave chat
  public async leaveChat(){
    return this.connection.stop();
  }
}
