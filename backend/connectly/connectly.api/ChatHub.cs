using connectly.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace connectly.api;

public class ChatHub:Hub
{
    private readonly IDictionary<string, UserRoomConnection> _connections;

    public ChatHub(IDictionary<string,UserRoomConnection> connections)
    {
        _connections = connections;
    }
    public async Task JoinRoom(UserRoomConnection userRoomConnection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userRoomConnection.room!);
        _connections[Context.ConnectionId] = userRoomConnection;
        await Clients.Group(userRoomConnection.room)
                     .SendAsync("ReciveMessage","Bot",$"{userRoomConnection.user} has Joined the room",DateTime.Now,userRoomConnection.room);
        await ConnectedUsers(userRoomConnection.room);
    }

    public async Task SendMessage(string message)
    {
        if(_connections.TryGetValue(Context.ConnectionId,out UserRoomConnection userRoomConnection))
        {
            await Clients.Group(userRoomConnection.room)
                .SendAsync("ReciveMessage", userRoomConnection.user, message, DateTime.Now,userRoomConnection.room);
        }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if(!_connections.TryGetValue(Context.ConnectionId,out UserRoomConnection userRoomConnection))
        {
            return base.OnDisconnectedAsync(exception);
        }
        _connections.Remove(Context.ConnectionId);
        Clients.Group(userRoomConnection.room)
            .SendAsync("ReciveMessage","", $"{userRoomConnection.user} has left the room",DateTime.Now,userRoomConnection.room);
        ConnectedUsers(userRoomConnection.room);
        return base.OnDisconnectedAsync(exception);
    }

    public Task ConnectedUsers(string room)
    {
        var users = _connections.Values
                    .Where(x => x.room == room)
                    .Select(y => y.user);
        return Clients.Group(room).SendAsync("ConnectedUsers", users,room);
    }
}

