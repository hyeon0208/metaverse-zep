let spartan = App.loadSpritesheet('spartan.png', 64, 96, {
    left: [0, 1, 2, 3], // left 라는 이미 정해진 왼쪽 방향으로 걸을 때의 애니메이션 이름
    up: [0], // 그 이름에 쓰일 전체 파일에서의 인덱스 넘버들
    down: [0],
    right: [0, 1, 2, 3],
}, 8); // 1초에 8장으로 한다.


// 플레이어가 입장할 때(listen), 바로 spartan 그림으로 교체  (action)
App.onJoinPlayer.Add(function(player){
	
		player.sprite = spartan; 
	  // 플레이어 속성이 변경되었으므로 호출해서 실제 반영해준다.
		player.sendUpdated();

})