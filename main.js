// zep 앱은 main.js 압축파일만 반영됨.
App.onJoinPlayer.Add(function(player){
    player.moveSpeed = 300; // 플레이어의 속도를 300으로 올리고
    player.title = "SHJ";
    player.sendUpdated(); // 이 내용을 업데이트.
})