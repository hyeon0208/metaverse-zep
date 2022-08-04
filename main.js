// // !! zep 앱은 main.js 압축파일만 반영됨.

// --------- 캐릭터 이미지 바꾸기 ------------
// App.loadSpritesheet(fileName: string, frameWidth: integer, frameHeight: integer, anims: array, frameRate: integer): ScriptDynamicResource
// 
// let cimg = App.loadSprite('test.png', 64, 96, {
//     left: [5, 6, 7, 8, 9], // 이미 정해진 왼쪽 방향으로 걸을 때의 애니메이션 이름
//     up: [15, 16, 17, 18, 19], // 윗쪽 방향키를 입력할 떄 그 이름에 쓰일 전체 파일에서의 인덱스 넘버들
//     down: [0, 1, 2, 3, 4], // 아래쪽 방향키 입력할 때
//     right: [10, 11, 12, 13, 14], // 오른쪽 방향키 입력할때.
// }, 8); // 1초에 8장으로 한다.



// App.onJoinPlayer.Add(function(player){

//     // --------  MBTI 랜덤하게 추가. ----------
//     let mbti = ["ENFP", "ESTJ", "INFP", "ISTP"];

//     // Math.random으로 4개의 mbti를 랜덤하게 출력, Math.floor 로 소수점 절삭. 
//     let nth = Math.floor(Math.random() * mbti.length);

//     player.sprite = cimg; // sprite 시트 를 cimg 변수 이미지로 교체.


//     player.moveSpeed = 300; // 플레이어의 속도를 300으로 올리고
//     player.title = mbti[nth]; // 플레이어에게 title을 부여함.

//     player.sendUpdated(); // 이 내용들을 업데이트.
// })

// //  -------- 플레이어 채팅 기능 구현. ----------------
// App.onSay.Add(function(player, text) {
//     App.showCenterLabel(text);
// })
      
// 채팅 칠시 공지 활성화
App.onSay.Add(function(player, text) {

    if (text == 'speed up') {
        player.moveSpeed = 500;
    }

    if (text == 'speed down') {
        player.moveSpeed = 30;
    }

    player.sendUpdated();

    let message = player.name + "님이 " + text + "라고 말했습니다.";
    App.showCenterLabel(message);
})

// ------- 맵 조작 ----------

// 구름 오브젝트 추가 및 오브젝트 이동.

let cloud = App.loadSpritesheet("cloud.png", 659, 400, [0], 6);

App.onJoinPlayer.Add(function() {
  Map.putObject(5, 5, cloud);  // 오브젝트 넣기 (  x 좌표, y좌표, 넣을 객체 )
  Map.moveObject(5, 5, 2, 2, 34); // 오브젝트 움직이기 
                        // ( x좌표, y좌표 오브젝트에 있는 오브젝트를, x좌표, y좌표로 ?초동안 움직여라 )
});


