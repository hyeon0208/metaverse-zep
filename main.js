// zep 앱은 main.js 압축파일만 반영됨.
App.onJoinPlayer.Add(function(player){

    // MBTI 랜덤하게 추가.
    let mbti = ["ENFP", "ESTJ", "INFP", "ISTP"];

    // Math.random으로 4개의 mbti를 랜덤하게 출력, Math.floor 로 소수점 절삭. 
    let nth = Math.floor(Math.random() * mbti.length);

    player.moveSpeed = 300; // 플레이어의 속도를 300으로 올리고
    player.title = mbti[nth];
    player.sendUpdated(); // 이 내용을 업데이트.
})