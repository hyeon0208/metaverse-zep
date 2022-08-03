App.onJoinPlayer.Add(function(player){
    player.moveSpeed = 300; // 플레이어의 속도를 300으로 올리고
    player.sendUpdated(); // 이 내용을 업데이트.
})