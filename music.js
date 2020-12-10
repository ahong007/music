const log = console.log.bind(console)

const e = function (selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错了`
        alert(s)
        return null
    } else {
        return element
    }
}
const removeClassAll = function(className) {
    let selector = '.' + className
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.remove(className)
    }
}

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `选择器 ${selector} 写错了`
        alert(s)
        return []
    } else {
        return elements
    }
}

const bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}
const bindAll = function(selector, eventName, callback) {
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}
const bindEventPlay = () => {
    let button = e('.play')
    let audio = e('.music')
    button.addEventListener('click',function (event) {
        if(audio.paused === true){
            log('播放音乐')
            button.classList.add('fa-stop')
            audio.play()
        } else {
            log('暂停音乐')
            button.classList.remove('fa-stop')
            audio.pause()
        }
    })
}
const nextIndex = function(slide, offset) {
    let activeIndex = parseInt(slide.dataset.active, 10)
    log('activeIndex',activeIndex)
    let i = (activeIndex + offset + 3) % 3
    log('i is', i)
    return i
}

const bindEventSlide = function() {
    let selector = '.slide-button'
    bindAll(selector, 'click', function(event) {
        let self = event.target
        let slide = self.closest('.container')
        let offset = Number(self.dataset.offset)
        let index = nextIndex(slide, offset)
        showAtIndex(slide, index)
    })
}

const showAtIndex = function(slide, index) {
    slide.dataset.active = index
    console.log('index',index)
    let next_music = `mp3/${index}.mp3`
    let audio = e('.music')
    audio.src = next_music
    removeClassAll('active')
    let dotSelector = String(`.dot-${index}`)

    let dot = e(dotSelector)
    dot.classList.add('active')
}

const bindEventCanplay = function() {
    let audio = e('.music')
    audio.addEventListener('canplay', function() {
        log('duration is', audio.duration)
        audio.play()
        audio.duration
    })
}

const time_music =function (audio) {
    let time_music = ''
    if(parseInt(audio.currentTime) < 60) {
        time_music = '0' + ':' + parseInt(audio.currentTime)
        return time_music
    } else {
        let m = parseInt(audio.currentTime)  % 60
        let a = parseInt(audio.currentTime) / 60
        let b = parseInt(a)
        time_music = String(b) + ':' + String(m)
        return time_music
    }
}

const bindEvents_dot = () => {
    let inner = e('.inner')
    let outer = e('.outer')
    let dot = e('.dot')
    let result = e('.id-em-move')
    let audio = e('.music')

    let max = outer.offsetWidth
    let moving = false
    let offset = 0

    dot.addEventListener('mousedown', (event) => {
        log('event', event.clientX, dot.offsetLeft, event.clientX - dot.offsetLeft)
        offset = event.clientX - dot.offsetLeft
        moving = true
    })

    document.addEventListener('mouseup', (event) => {
        moving = false
    })
    document.addEventListener('mousemove', (event) => {
        let button = e('.play')
        if (moving) {
            let x = event.clientX - offset
            if (x >= max) {
                button.classList.remove('fa-stop')
                x = max
            }
            if (x < 0) {
                x = 0
            }
            audio.pause()
            let width = (x / max) * 100
            let width_music = x / max
            inner.style.width = String(width) + '%'
            audio.currentTime = width_music * audio.duration
            result.innerHTML = time_music(audio)
        }
    })

    audio.addEventListener('timeupdate',function (event) {
        log('时间正在更新')
        log('moving' ,moving)
        if(moving === false) {
            let b = audio.currentTime / audio.duration * 100
            inner.style.width = String(b) + '%'
            result.innerHTML = time_music(audio)
        }
    })
}


const __main = () => {
    bindEventPlay()
    bindEventSlide()
    bindEventCanplay()
    bindEvents_dot()
}

__main()