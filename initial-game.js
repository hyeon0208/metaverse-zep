const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_JUDGE = 3004;
const STATE_END = 3005;

const WORD_LINES = [
    '한글날 휴게소 현기증 형광펜 호날두 허니문 하노이 핫도그 홍두깨 헤드셋 해돋이 한라봉 한라산 호랑이 허리띠 현미경 흰머리 황무지 햄버거 학부모 휘발유 허벅지 하수구 호신술 홍수아 화승총 허스키 햄스터 해운대 활주로 휴지통 화장품 회초리 핫팬츠 하회탈',
    '피규어 팔꿈치 포도주 피라냐 피라미 피뢰침 프리킥 프라하 포미닛 팥빙수 표백제 판소리 피시방 팔씨름 피아노 편의점 파자마 포장지 표지판 파충류 파출부 파출소 포청천 팬클럽 포켓볼 피카소 피카츄 폭탄주 피터팬',
    '태극기 태권도 턱걸이 테니스 트렁크 터미널 퇴마사 토마토 탬버린 투석기 턱시도 탕수육 토스트 태양계 티아라 타이밍 탈의실 트위터 퇴직금 통조림 태진아 태평양 테헤란',
    '캥거루 콧구멍 코끼리 캐나다 콩나물 코너킥 컨디션 코러스 카메라 카메오 키보드 콤바인 코뿔소 케이크 코코넛 카타르 칵테일 커플링',
    '참기름 철가방 초능력 축농증 취두부 청계천 책갈피 책꽂이 초능력 축농증 창덕궁 차두리 최루탄 최면술 칠면조 청바지 청소년 출석부 찹쌀떡 청와대 첫인상 치와와 초인종 추어탕 초음파 침전물 청첩장 초콜릿 치트키 출판사 챔피언 침팬지 최홍만',
    '계기판 개나리 기내식 강낭콩 교도관 고드름 골동품 기러기 가로등 가래떡 글러브 그림자 기모노 금메달 거머리 교무실 공무원 건망증 구미호 김병만 국방부 거북선 광복절 곱빼기 가속도 각선미 기숙사 가오리 걸음마 강의실 거짓말 교차로 골키퍼 과태료 김태원 김태희 건포도 곰팡이 골판지 공포탄 김흥국 광화문 공휴일 고현정 꽹과리 까나리 깍두기 꽃다발 꽃등심 꼽등이 까마귀 까치발 깐풍기',
    '케첩 킹카 킹콩 컨닝 채찍 창문 참깨 천국 축구 출근 친구 치과 취권 채권 초과 족발 절벽 젖병 주부 전복 중복 정복 절반 족보 쟁반 주번 좀비 제비 사과 사기 시급 시계 손금 선거 수능 설날 스님',
    '모래 미래 미로 만루 떡밥 딸기 떡국 두유 득음 뉴욕 노을 낙엽 녹용 노인 눈물 냉면 나비 나방 가위 거울 근육 기타 깃털 구토 굴뚝 개념 그네 구름 기린 경마 경매 고막 가방 공부 고백 간병 갈비 김밥 거봉 군밤 기분 건빵 가시'
];

let WORDS = [];

let _state = STATE_INIT;
let _stateTimer = 0;
let _timer = 0;
let _choanswer = '';
let _answer = '';
let _start = false;
let _widget = null; // using for contents UI
let _players = App.player;
let _result = '';

for(let w in WORD_LINES)
    WORDS =  WORDS.concat(WORD_LINES[w].trim().split(' '));

function cho_hangul(str) {
    cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    result = "";
    for (let i = 0; i < str.length; ++i ) {
      code = str.charCodeAt(i)-44032;
      if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
      else result += str.charAt(i);
    }
    return result;
}


App.onStart.Add(function(){
    startState(STATE_INIT);
});

// when chatting event
// 채팅을 치면 호출되는 이벤트
// player : person who chatted
// text : chat text
// return : enter chatting box
// return false or true : not appear in chatting box
App.onSay.add(function(player, text) {
    if(_state == STATE_PLAYING)
    {
        if(_answer == text)
        {
            _result = player.name + '님 정답!\n정답은 ' + _answer;

            startState(STATE_JUDGE);
        }
    }
});

function startState(state) {
    _state = state;
    _stateTimer = 0;

    switch(_state)
    {
        case STATE_INIT:
            if(_widget)
            {
                _widget.destroy();
                _widget = null;
            }
            _answer = WORDS[Math.floor(Math.random() * WORDS.length)];
            _timer = 60;
    
            _choanswer = cho_hangul(_answer);
    
            // called html UI
            // param1 : file name
            // param2 : position 
            // [ top, topleft, topright, middle, middleleft, middleright, bottom, bottomleft, bottomright, popup ]
            // param3 : width size
            // param4 : height size
            _widget = App.showWidget('widget.html', 'top', 200, 300);
            
            _widget.sendMessage({
                state: _state,
                timer: _timer,
                answer: _choanswer,
            });

            startState(STATE_READY);
            break;
        case STATE_READY:
            _start = true;
            startState(STATE_PLAYING);
            break;
        case STATE_PLAYING:
            App.showCenterLabel('목표: 초성힌트로 단어를 찾아내세요.',0xFFFFFF, 0x000000, 115);
            _widget.sendMessage({
                state: _state,
                timer: _timer,
                answer: _choanswer,
            });
            break;
        case STATE_JUDGE:
            break;
        case STATE_END:
            if(_widget)
            {
                _widget.destroy();
                _widget = null; // must to do for using again
            }

            _start = false;
            break;
    }
}

App.onLeavePlayer.Add(function(p) {
    p.title = null;
    p.sprite = null;
    p.moveSpeed = 80;
    p.sendUpdated();
});

App.onDestroy.Add(function() {
    _start = false;
    
    if(_widget)
    {
        _widget.destroy();
        _widget = null;
    }
});

App.onUpdate.Add(function(dt) {
    if(!_start)
        return;

    _stateTimer += dt;

    switch(_state)
    {
        case STATE_INIT:
            break;
        case STATE_READY:
            _start = true;
            break;
        case STATE_PLAYING:
            if(_stateTimer >= 1)
            {
                _stateTimer = 0;
                _timer -= 1;
            }

            if(_timer == 0)
            {
                _result = '정답은 ' + _answer + ' 입니다.';
                startState(STATE_JUDGE);
            }
            break;
        case STATE_JUDGE:
            App.showCenterLabel(_result, 0xFFFFFF, 0x000000, 115);

            if(_stateTimer >= 3)
                startState(STATE_END);
            break;
        case STATE_END:
            break;
    }
});