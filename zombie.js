// load sprite
let monster = App.loadSpritesheet('monster.png', 96, 96, {
    // defined base anim
    left: [8, 9, 10, 11],
    up: [12, 13, 14, 15],
    down: [4, 5, 6, 7],
    right: [16, 17, 18, 19],
}, 8);

const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_JUDGE = 3004;
const STATE_END = 3005;

let _start = false; // Whether the game starts
let _players = App.players; // App.players : get total players
let _lastSurvivor = null;
let _zombieKing = [];
let _state = STATE_INIT;
let _stateTimer = 0; // Timer to check status value
let _live = 0; // number of survivors
let _resultstr;

function startApp()
{
    if(_players.length > 2)
    {
        // Set the number of zombies
        let zombiCnt = Math.floor(_players.length * 0.1);
        if(zombiCnt < 1)
            zombiCnt = 1;

        let allPlayer = [];
        let zombieIdx = [];

        for(let i = 0; i < _players.length; ++i)
        {
            allPlayer.push(_players[i]);
        }

        for(let i = 0; i < zombiCnt; ++i)
        {
            let index = Math.floor(allPlayer.length * Math.random());
            if(!zombieIdx.includes(allPlayer[index].id))
            {
                zombieIdx.push(allPlayer[index].id);
                allPlayer.splice(index, 1);
            }
        }

        // give players zombie attribute
        for(let i in _players)
        {
            let p = _players[i];
            // create and utilize option data using tags.
            p.tag = {};
            if(zombieIdx.includes(p.id))
            {
                p.tag.zombie = true;
                p.tag.attack = 0;
            }
            else
            {
                p.tag.zombie = false;
                p.tag.attack = 0;
                _live++;
            }
            
            // when player property changed have to call this method
            // 플레이어 속성 변경 시 반드시 호출하여 업데이트 한다.
            p.sendUpdated();
        }                                                                                               
        
        _start = true;
    }
    else
    {
        App.showCenterLabel(`Playable number of people: 3 or more`);
        startState(STATE_END);
    }
}

function startState(state)
{
    _state = state;
    _stateTimer = 0;

    switch(_state)
    {
        case STATE_INIT:
            startApp();
            break;
        case STATE_READY:
            App.showCenterLabel("The game will start soon.");
            for(let i in _players)
            {
                let p = _players[i];
                p.moveSpeed = 0;
                // Change the attribute of zombies
                if(p.tag.zombie)
                {
                    p.title = '<P:ZERO>';
                    p.sprite = monster;
                }
                p.sendUpdated();
            }
            break;
        case STATE_PLAYING:
            for(let i in _players)
            {
                let p = _players[i];
                // Change speed and label text according to player status
                if(p.tag.zombie)
                {
                    p.moveSpeed = 85;
                    p.showCenterLabel('Infect people!');
                }
                else
                {
                    p.moveSpeed = 80;
                    p.showCenterLabel('Survive from zombies!');
                }
                p.sendUpdated();
            }
            break;
        case STATE_JUDGE:
            for(let i in _players) {
                let p = _players[i];
                p.moveSpeed = 0;
                p.sendUpdated();
            }

            judgement(_live);
            break;
        case STATE_END:
            _start = false;

            for(let i in _players)
            {
                let p = _players[i];
                p.moveSpeed = 80;
                p.title = null;
                p.sprite = null;
                p.sendUpdated();
            }

            // Clear all objects in the map
            Map.clearAllObjects();
            break;
    }
   
}

function checkSuvivors()
{
    let resultlive = 0;
    for(let i in _players)
    {
        let p = _players[i];
        if(!p.tag.zombie)
        {
            _lastSurvivor = p;
            ++resultlive;
        }
    }

    return resultlive;
}

function judgement(number)
{   
    // The highest number of attacks among all players
    let attack = 0;

    for(let i in _players)
    {
        let p = _players[i];

        if(p.tag.attack > attack)
            attack = p.tag.attack;            
    }
    
    zombieKing = [];
    for(let i in _players)
    {   
        let p = _players[i];
        
        if(p.tag.attack == attack)
            zombieKing.push(p);
    }

    let index = Math.floor(Math.random() * zombieKing.length);

    if(number == 1) // when there are survivors
        resultstr = `${_lastSurvivor.name} is the last survivor!\nThe Strongest Zombie [` + zombieKing[index].name + '] Number of infections : ' + attack;
    else if(number == 0) // when there are no survivors
        resultstr = `No survivors.\nThe Strongest Zombie [` + zombieKing[index].name + '] Number of infections : ' + attack;
}

App.onStart.Add(function(){
    startState(STATE_INIT);
});

// when player join the space event
// 플레이어가 스페이스에 입장 했을 때 이벤트
App.onJoinPlayer.Add(function(p) {
    p.tag = {
        zombie : false,
        attack : 0,
    };

    if(_start) {
        p.tag.zombie = true;
        p.sprite = monster;
        p.sendUpdated();
        
        judgement(checkSuvivors());
    }   
    _players = App.players;
});

// when player leave the space event
// 플레이어가 스페이스를 나갔을 때 이벤트
App.onLeavePlayer.Add(function(p) {
    if(_start) {
        judgement(checkSuvivors());
    }

    p.title = null;
    p.sprite = null;
    p.moveSpeed = 80;
    p.sendUpdated();

    _players = App.players;
});


// when the game block is pressed event
// 게임 블록을 밟았을 때 호출되는 이벤트
App.onDestroy.Add(function() {
    App.stopSound();
});

// when player touched other player event
// 플레이어가 다른 플레이어와 부딪혔을 때 
App.onPlayerTouched.Add(function(sender, target, x, y) {
    if(_state != STATE_PLAYING)
        return;

    if(!sender.tag.zombie)
        return;

    if(target.tag.zombie)
        return;

    target.tag.zombie = true;
    target.sprite = monster;
    sender.tag.attack += 1;
    target.sendUpdated();
    
    _live = checkSuvivors();
    if(_live >= 2)
    {
        App.showCenterLabel(`${target.name} is infected!\n(${_live} survivors!)`);
        return;
    }
    else
        startState(STATE_JUDGE);
});

// called every 20ms
// 20ms 마다 호출되는 업데이트
// param1 : deltatime ( elapsedTime )
App.onUpdate.Add(function(dt) {
    if(!_start)
        return;
    
    _stateTimer += dt;

    switch(_state)
    {
        case STATE_INIT:
            App.showCenterLabel("Become a zombie and infect people. The host is faster.\nPeople do their best to run away and be the last survivor.");
            
            if(_stateTimer >= 5)
                startState(STATE_READY);
            break;
        case STATE_READY:
            if(_stateTimer >= 3)
                startState(STATE_PLAYING);
            break;
        case STATE_PLAYING:
            break;
        case STATE_JUDGE:
            App.showCenterLabel(resultstr);

            if(_stateTimer >= 5)
                startState(STATE_END);
            break;
        case STATE_END:
            break;    
    }
});